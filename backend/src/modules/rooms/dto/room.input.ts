import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsArray, IsNumber, IsUUID, IsEnum, Min } from 'class-validator';
import { RoomType, RoomStatus } from '../entities/room.entity';

@InputType()
export class CreateRoomInput {
  @Field()
  @IsNotEmpty()
  roomNumber: string;

  @Field(() => RoomType)
  @IsEnum(RoomType)
  type: RoomType;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  pricePerNight: number;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  capacity: number;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  size: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  images?: string[];

  @Field()
  @IsUUID()
  hotelId: string;
}

@InputType()
export class UpdateRoomInput {
  @Field({ nullable: true })
  @IsOptional()
  roomNumber?: string;

  @Field(() => RoomType, { nullable: true })
  @IsOptional()
  @IsEnum(RoomType)
  type?: RoomType;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerNight?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  size?: number;

  @Field(() => RoomStatus, { nullable: true })
  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  images?: string[];

  @Field({ nullable: true })
  @IsOptional()
  isActive?: boolean;
}