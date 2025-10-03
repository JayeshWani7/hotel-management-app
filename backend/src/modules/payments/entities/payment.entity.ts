import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
import { Booking } from '../../bookings/entities/booking.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'The status of the payment',
});

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  UPI = 'upi',
  NET_BANKING = 'net_banking',
  WALLET = 'wallet',
}

registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
  description: 'The method used for payment',
});

@Entity('payments')
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field(() => Float)
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  @Field(() => PaymentStatus)
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  @Field(() => PaymentMethod, { nullable: true })
  method?: PaymentMethod;

  @Column({ nullable: true })
  @Field({ nullable: true })
  transactionId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  cashfreeOrderId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  cashfreePaymentId?: string;

  @Column('json', { nullable: true })
  cashfreeResponse?: any; // Not exposed to GraphQL for security

  @Column({ nullable: true })
  @Field({ nullable: true })
  failureReason?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  refundId?: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  @Field(() => Float, { nullable: true })
  refundAmount?: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  paymentDate?: Date;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  // Relations
  @Column('uuid')
  bookingId: string;

  @OneToOne(() => Booking, (booking) => booking.payment)
  @JoinColumn({ name: 'bookingId' })
  @Field(() => Booking)
  booking: Booking;
}