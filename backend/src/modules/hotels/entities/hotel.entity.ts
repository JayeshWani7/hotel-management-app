import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Room } from '../../rooms/entities/room.entity';

@Entity('hotels')
@ObjectType()
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column('text')
  @Field()
  description: string;

  @Column()
  @Field()
  address: string;

  @Column()
  @Field()
  city: string;

  @Column()
  @Field()
  state: string;

  @Column()
  @Field()
  country: string;

  @Column()
  @Field()
  postalCode: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  email?: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  @Field(() => Float, { nullable: true })
  longitude?: number;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  @Field(() => Float)
  rating: number;

  @Column('simple-array', { nullable: true })
  @Field(() => [String], { nullable: true })
  amenities?: string[];

  @Column('simple-array', { nullable: true })
  @Field(() => [String], { nullable: true })
  images?: string[];

  @Column({ default: true })
  @Field()
  isActive: boolean;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  policies?: string;

  @Column('time', { nullable: true })
  @Field({ nullable: true })
  checkInTime?: string;

  @Column('time', { nullable: true })
  @Field({ nullable: true })
  checkOutTime?: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Room, (room) => room.hotel)
  @Field(() => [Room], { nullable: true })
  rooms?: Room[];
}