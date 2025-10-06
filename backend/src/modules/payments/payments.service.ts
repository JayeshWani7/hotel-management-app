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

  // async initiatePayment(bookingId: string): Promise<any> {
  //   const booking = await this.bookingsRepository.findOne({
  //     where: { id: bookingId },
  //     relations: ['user', 'room', 'room.hotel'],
  //   });

  //   if (!booking) {
  //     throw new NotFoundException(`Booking with ID ${bookingId} not found`);
  //   }

  //   if (booking.status !== BookingStatus.PENDING) {
  //     throw new BadRequestException('Booking is not in pending status');
  //   }

  //   // Check if payment already exists
  //   const existingPayment = await this.paymentsRepository.findOne({
  //     where: { bookingId },
  //   });

  //   if (existingPayment && existingPayment.status === PaymentStatus.SUCCESS) {
  //     throw new BadRequestException('Payment already completed for this booking');
  //   }

  //   try {
  //     const orderData = {
  //       order_id: `ORDER_${bookingId}_${Date.now()}`,
  //       order_amount: booking.totalAmount.toString(),
  //       order_currency: 'INR',
  //       customer_details: {
  //         customer_id: booking.user.id,
  //         customer_name: `${booking.user.firstName} ${booking.user.lastName}`,
  //         customer_email: booking.user.email,
  //         customer_phone: booking.user.phone || '9999999999',
  //       },
  //       order_meta: {
  //         return_url: `${this.configService.get('FRONTEND_URL', 'http://localhost:5173')}/payment/callback?booking_id={booking_id}`,
  //         notify_url: `${this.configService.get('BACKEND_URL', 'http://localhost:3000')}/api/payments/webhook`,
  //       },
  //     };

  //     const headers = {
  //       'Content-Type': 'application/json',
  //       'x-client-id': this.cashfreeAppId,
  //       'x-client-secret': this.cashfreeSecretKey,
  //       'x-api-version': '2023-08-01',
  //     };

  //     // const response = await axios.post(
  //       const response = await axios.default.post(
  //       `${this.cashfreeBaseUrl}/orders`,
  //       orderData,
  //       { headers }
  //     );

  //     // Create or update payment record
  //     let payment = existingPayment;
  //     if (!payment) {
  //       payment = this.paymentsRepository.create({
  //         bookingId,
  //         amount: booking.totalAmount,
  //         status: PaymentStatus.PENDING,
  //       });
  //     }

  //     payment.cashfreeOrderId = response.data.order_id;
  //     payment.cashfreeResponse = response.data;
      
  //     await this.paymentsRepository.save(payment);

  //     return {
  //       orderId: response.data.order_id,
  //       paymentSessionId: response.data.payment_session_id,
  //       orderToken: response.data.order_token || null,
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(`Failed to initiate payment: ${error.message}`);
  //   }
  // }

  // async initiatePayment(bookingId: string): Promise<any> {
  //   const booking = await this.bookingsRepository.findOne({
  //     where: { id: bookingId },
  //     relations: ['user', 'room', 'room.hotel'],
  //   });
  
  //   if (!booking) {
  //     throw new NotFoundException(`Booking with ID ${bookingId} not found`);
  //   }
  
  //   if (booking.status !== BookingStatus.PENDING) {
  //     throw new BadRequestException('Booking is not in pending status');
  //   }
  
  //   const existingPayment = await this.paymentsRepository.findOne({ where: { bookingId } });
  
  //   if (existingPayment && existingPayment.status === PaymentStatus.SUCCESS) {
  //     throw new BadRequestException('Payment already completed for this booking');
  //   }
  
  //   try {
  //     // Step 1: Create Cashfree Order
  //     const orderData = {
  //       order_id: `ORDER_${bookingId}_${Date.now()}`,
  //       order_amount: booking.totalAmount.toString(),
  //       order_currency: 'INR',
  //       customer_details: {
  //         customer_id: booking.user.id,
  //         customer_name: `${booking.user.firstName} ${booking.user.lastName}`,
  //         customer_email: booking.user.email,
  //         customer_phone: booking.user.phone || '9999999999',
  //       },
  //       order_meta: {
  //         return_url: `${this.configService.get('FRONTEND_URL') || 'http://localhost:5173'}/payment/callback?order_id={order_id}`,
  //         notify_url: `${this.configService.get('BACKEND_URL') || 'http://localhost:3000/'}/api/payments/webhook`,
  //       },
  //     };
  
  //     const headers = {
  //       'Content-Type': 'application/json',
  //       'x-client-id': this.cashfreeAppId,
  //       'x-client-secret': this.cashfreeSecretKey,
  //       'x-api-version': '2023-08-01',
  //     };
  
  //     const orderResponse = await axios.default.post(
  //       `${this.cashfreeBaseUrl}/orders`,
  //       orderData,
  //       { headers },
  //     );
  
  //     const { order_id, payment_session_id } = orderResponse.data;
  
  //     // Step 2: Call Cashfree “Order Pay” using UPI session
  //     const payResponse = await axios.default.post(
  //       `${this.cashfreeBaseUrl}/orders/sessions`,
  //       {
  //         payment_session_id,
  //         payment_method: {
  //           upi: {
  //             channel: 'link', // generates UPI link
  //           },
  //         },
  //       },
  //       { headers },
  //     );
  
  //     console.log('\n \n console = ' + payResponse.data.data.url)
  //     // Extract payment link from response
  //     const paymentLink = payResponse.data?.data?.url || null;
  
  //     // Save Payment Info in DB
  //     let payment = existingPayment;
  //     if (!payment) {
  //       payment = this.paymentsRepository.create({
  //         bookingId,
  //         amount: booking.totalAmount,
  //         status: PaymentStatus.PENDING,
  //       });
  //     }
  
  //     payment.cashfreeOrderId = order_id;
  //     payment.cashfreeResponse = { ...orderResponse.data, payResponse: payResponse.data };
  //     await this.paymentsRepository.save(payment);
  
  //     // Step 3: Return only payment link to frontend
  //     return { paymentLink,orderId: order_id };
  //   } catch (error) {
  //     console.error('Cashfree Payment Error:', error.response?.data || error.message);
  //     throw new BadRequestException(`Failed to initiate payment: ${error.message}`);
  //   }
  // }
  
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
  
    const existingPayment = await this.paymentsRepository.findOne({ where: { bookingId } });
  
    if (existingPayment && existingPayment.status === PaymentStatus.SUCCESS) {
      throw new BadRequestException('Payment already completed for this booking');
    }
  
    try {
      // Prepare payment link data
      const paymentLinkData = {
        customer_details: {
          customer_email: booking.user.email,
          customer_name: `${booking.user.firstName} ${booking.user.lastName}`,
          customer_phone: booking.user.phone || '9999999999',
        },
        link_amount: booking.totalAmount,
        link_currency: 'INR',
        link_purpose: 'Payment for Hotel Booking',
        link_id : `${bookingId}_${Date.now()}`,
        link_meta: {
          return_url: `${this.configService.get('FRONTEND_URL') || 'http://localhost:5173'}/payment/callback?link_id={link_id}`,
          notify_url: `${this.configService.get('BACKEND_URL') || 'http://localhost:3000/'}/api/payments/webhook`,
        },
        link_auto_reminders: true,
        link_notify: {
          send_email: true,
          send_sms: false,
        },
      };
  
      // Send API request to create payment link
      const headers = {
        'Content-Type': 'application/json',
        'x-client-id': this.cashfreeAppId,
        'x-client-secret': this.cashfreeSecretKey,
        'x-api-version': '2023-08-01',
      };
  
      const response = await axios.default.post(
        'https://sandbox.cashfree.com/pg/links',
        paymentLinkData,
        { headers }
      );
  
      const { link_url, link_id } = response.data;
  
      // Save payment information
      let payment = existingPayment;
      if (!payment) {
        payment = this.paymentsRepository.create({
          bookingId,
          amount: booking.totalAmount,
          status: PaymentStatus.PENDING,
        });
      }
  
      payment.cashfreeOrderId = response.data.link_id;
      payment.cashfreePaymentId = response.data.cf_link_id;

      await this.paymentsRepository.save(payment);
  
      // Return payment link to frontend
      return { paymentLink: link_url };
    } catch (error) {
      console.error('Cashfree Payment Error:', error.response?.data || error.message);
      throw new BadRequestException(`Failed to initiate payment: ${error.message}`);
    }
  }
  
  
  async verifyPayment(link_id: string): Promise<boolean> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-client-id': this.cashfreeAppId,
        'x-client-secret': this.cashfreeSecretKey,
        'x-api-version': '2023-08-01',
      };
      // https://sandbox.cashfree.com/pg/links/a8e01f24-d5e5-49bc-b7c1-2db760dad080_1759778516917/orders
      // Fetch order details from Cashfree
      const response = await axios.default.get(
        `${this.cashfreeBaseUrl}/links/${link_id}/orders`,
        { headers }
      );
  
      const payment = await this.paymentsRepository.findOne({
        where: { cashfreeOrderId: link_id },
        relations: ['booking'],
      });
  
      if (!payment) {
        throw new NotFoundException(`Payment with order ID ${link_id} not found`);
      }
      console.log(response);
      const orderStatus = response.data[0].order_status; // 'PAID', 'FAILED', etc.
  
      if (orderStatus === 'PAID') {
        payment.status = PaymentStatus.SUCCESS;
        payment.paymentDate = new Date();
        payment.cashfreePaymentId = response.data.cf_order_id;
  
        // Update booking status
        await this.bookingsRepository.update(
          { id: payment.bookingId },
          { status: BookingStatus.CONFIRMED }
        );
  
      } else if (orderStatus === 'FAILED') {
        payment.status = PaymentStatus.FAILED;
        payment.failureReason = response.data.order_note || 'Payment failed';
      }
  
      await this.paymentsRepository.save(payment);
  
      return orderStatus === 'PAID';
    } catch (error) {
      throw new BadRequestException(`Failed to verify payment: ${error.message}`);
    }
  }
  

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({where : { cashfreeOrderId : id}});

    if (!payment) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return payment;
  }

  // async verifyPayment(orderId: string): Promise<boolean> {
  //   try {
  //     const headers = {
  //       'Content-Type': 'application/json',
  //       'x-client-id': this.cashfreeAppId,
  //       'x-client-secret': this.cashfreeSecretKey,
  //       'x-api-version': '2023-08-01',
  //     };

  //     // const response = await axios.get(
  //       const response = await axios.default.get(
  //       `${this.cashfreeBaseUrl}/orders/${orderId}`,
  //       { headers }
  //     );

  //     const payment = await this.paymentsRepository.findOne({
  //       where: { cashfreeOrderId: orderId },
  //       relations: ['booking'],
  //     });

  //     if (!payment) {
  //       throw new NotFoundException(`Payment with order ID ${orderId} not found`);
  //     }

  //     if (response.data.order_status === 'PAID') {
  //       payment.status = PaymentStatus.SUCCESS;
  //       payment.paymentDate = new Date();
  //       payment.cashfreePaymentId = response.data.cf_order_id;
        
  //       // Update booking status
  //       await this.bookingsRepository.update(
  //         { id: payment.bookingId },
  //         { status: BookingStatus.CONFIRMED }
  //       );
  //     } else if (response.data.order_status === 'FAILED') {
  //       payment.status = PaymentStatus.FAILED;
  //       payment.failureReason = response.data.order_note || 'Payment failed';
  //     }

  //     await this.paymentsRepository.save(payment);

  //     return payment.status === PaymentStatus.SUCCESS;
  //   } catch (error) {
  //     throw new BadRequestException(`Failed to verify payment: ${error.message}`);
  //   }
  // }

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