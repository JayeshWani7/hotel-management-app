import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as axios from 'axios';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';

@Injectable()
export class PaymentsService {
  private cashfreeBaseUrl: string;
  private cashfreeAppId: string;
  private cashfreeSecretKey: string;

  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private configService: ConfigService,
  ) {
    this.cashfreeBaseUrl = this.configService.get<string>('CASHFREE_BASE_URL');
    this.cashfreeAppId = this.configService.get<string>('CASHFREE_APP_ID');
    this.cashfreeSecretKey = this.configService.get<string>('CASHFREE_SECRET_KEY');
  }

  async initiatePayment(bookingId: string): Promise<any> {
    const booking = await this.bookingsRepository.findOne({
      where: { id: bookingId },
      relations: ['user', 'room', 'room.hotel'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Booking is not in pending status');
    }

    // Check if payment already exists
    const existingPayment = await this.paymentsRepository.findOne({
      where: { bookingId },
    });

    if (existingPayment && existingPayment.status === PaymentStatus.SUCCESS) {
      throw new BadRequestException('Payment already completed for this booking');
    }

    try {
      const orderData = {
        order_id: `ORDER_${bookingId}_${Date.now()}`,
        order_amount: booking.totalAmount.toString(),
        order_currency: 'INR',
        customer_details: {
          customer_id: booking.user.id,
          customer_name: `${booking.user.firstName} ${booking.user.lastName}`,
          customer_email: booking.user.email,
          customer_phone: booking.user.phone || '9999999999',
        },
        order_meta: {
          return_url: `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/payment/callback`,
          notify_url: `${this.configService.get('BACKEND_URL', 'http://localhost:3000')}/api/payments/webhook`,
        },
      };

      const headers = {
        'Content-Type': 'application/json',
        'x-client-id': this.cashfreeAppId,
        'x-client-secret': this.cashfreeSecretKey,
        'x-api-version': '2023-08-01',
      };

      // const response = await axios.post(
        const response = await axios.default.post(
        `${this.cashfreeBaseUrl}/orders`,
        orderData,
        { headers }
      );

      // Create or update payment record
      let payment = existingPayment;
      if (!payment) {
        payment = this.paymentsRepository.create({
          bookingId,
          amount: booking.totalAmount,
          status: PaymentStatus.PENDING,
        });
      }

      payment.cashfreeOrderId = response.data.order_id;
      payment.cashfreeResponse = response.data;
      
      await this.paymentsRepository.save(payment);

      return {
        orderId: response.data.order_id,
        paymentSessionId: response.data.payment_session_id,
        orderToken: response.data.order_token || null,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to initiate payment: ${error.message}`);
    }
  }

  async verifyPayment(orderId: string): Promise<boolean> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-client-id': this.cashfreeAppId,
        'x-client-secret': this.cashfreeSecretKey,
        'x-api-version': '2023-08-01',
      };

      // const response = await axios.get(
        const response = await axios.default.get(
        `${this.cashfreeBaseUrl}/orders/${orderId}`,
        { headers }
      );

      const payment = await this.paymentsRepository.findOne({
        where: { cashfreeOrderId: orderId },
        relations: ['booking'],
      });

      if (!payment) {
        throw new NotFoundException(`Payment with order ID ${orderId} not found`);
      }

      if (response.data.order_status === 'PAID') {
        payment.status = PaymentStatus.SUCCESS;
        payment.paymentDate = new Date();
        payment.cashfreePaymentId = response.data.cf_order_id;
        
        // Update booking status
        await this.bookingsRepository.update(
          { id: payment.bookingId },
          { status: BookingStatus.CONFIRMED }
        );
      } else if (response.data.order_status === 'FAILED') {
        payment.status = PaymentStatus.FAILED;
        payment.failureReason = response.data.order_note || 'Payment failed';
      }

      await this.paymentsRepository.save(payment);

      return payment.status === PaymentStatus.SUCCESS;
    } catch (error) {
      throw new BadRequestException(`Failed to verify payment: ${error.message}`);
    }
  }

  async handleWebhook(webhookData: any): Promise<void> {
    const { orderId, txStatus, referenceId } = webhookData;

    const payment = await this.paymentsRepository.findOne({
      where: { cashfreeOrderId: orderId },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with order ID ${orderId} not found`);
    }

    if (txStatus === 'SUCCESS') {
      payment.status = PaymentStatus.SUCCESS;
      payment.paymentDate = new Date();
      payment.transactionId = referenceId;

      // Update booking status
      await this.bookingsRepository.update(
        { id: payment.bookingId },
        { status: BookingStatus.CONFIRMED }
      );
    } else {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = webhookData.txMsg || 'Payment failed';
    }

    await this.paymentsRepository.save(payment);
  }

  async findByBookingId(bookingId: string): Promise<Payment | null> {
    return this.paymentsRepository.findOne({
      where: { bookingId },
      relations: ['booking'],
    });
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find({
      relations: ['booking', 'booking.user', 'booking.room'],
    });
  }
}