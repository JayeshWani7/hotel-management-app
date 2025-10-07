import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() body: { bookingId: string }) {
    const { bookingId } = body || {};
    const res = await this.paymentsService.initiatePayment(bookingId);
    return res;
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  async verify(@Query('order_id') orderId: string) {
    const ok = await this.paymentsService.verifyPayment(orderId);
    return { success: ok };
  }
}



