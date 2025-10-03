import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Resolver(() => Payment)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async initiatePayment(@Args('bookingId') bookingId: string): Promise<any> {
    return this.paymentsService.initiatePayment(bookingId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async verifyPayment(@Args('orderId') orderId: string): Promise<boolean> {
    return this.paymentsService.verifyPayment(orderId);
  }

  @Query(() => [Payment])
  @UseGuards(JwtAuthGuard)
  async getPayments(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  @Query(() => Payment)
  @UseGuards(JwtAuthGuard)
  async getPaymentByBooking(@Args('bookingId') bookingId: string): Promise<Payment> {
    return this.paymentsService.findByBookingId(bookingId);
  }
}