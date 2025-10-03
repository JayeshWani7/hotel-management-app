import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, Float, Int, registerEnumType } from '@nestjs/graphql';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Booking } from '../../bookings/entities/booking.entity';

export enum RoomType {
  SINGLE = 'single',
  DOUBLE = 'double',
  DELUXE = 'deluxe',
  SUITE = 'suite',
  FAMILY = 'family',
}

registerEnumType(RoomType, {
  name: 'RoomType',
  description: 'The type of room available',
});

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  OUT_OF_ORDER = 'out_of_order',
}

registerEnumType(RoomStatus, {
  name: 'RoomStatus',
  description: 'The current status of the room',
});

@Entity('rooms')
@ObjectType()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  roomNumber: string;

  @Column({
    type: 'enum',
    enum: RoomType,
  })
  @Field(() => RoomType)
  type: RoomType;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field(() => Float)
  pricePerNight: number;

  @Column('int')
  @Field(() => Int)
  capacity: number;

  @Column('int')
  @Field(() => Int)
  size: number; // in square meters

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
  })
  @Field(() => RoomStatus)
  status: RoomStatus;

  @Column('simple-array', { nullable: true })
  @Field(() => [String], { nullable: true })
  amenities?: string[];

  @Column('simple-array', { nullable: true })
  @Field(() => [String], { nullable: true })
  images?: string[];

  @Column({ default: true })
  @Field()
  isActive: boolean;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  // Relations
  @Column('uuid')
  hotelId: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  @JoinColumn({ name: 'hotelId' })
  @Field(() => Hotel)
  hotel: Hotel;

  @OneToMany(() => Booking, (booking) => booking.room)
  @Field(() => [Booking], { nullable: true })
  bookings?: Booking[];
}