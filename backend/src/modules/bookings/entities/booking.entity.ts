import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

registerEnumType(BookingStatus, {
  name: 'BookingStatus',
  description: 'The status of the booking',
});

@Entity('bookings')
@ObjectType()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  checkInDate: Date;

  @Column()
  @Field()
  checkOutDate: Date;

  @Column('int')
  @Field(() => Float)
  numberOfGuests: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field(() => Float)
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  @Field(() => BookingStatus)
  status: BookingStatus;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  specialRequests?: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  cancellationReason?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  cancellationDate?: Date;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  // Relations
  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;

  @Column('uuid')
  roomId: string;

  @ManyToOne(() => Room, (room) => room.bookings)
  @JoinColumn({ name: 'roomId' })
  @Field(() => Room)
  room: Room;

  @OneToOne(() => Payment, (payment) => payment.booking, { nullable: true })
  @Field(() => Payment, { nullable: true })
  payment?: Payment;
}