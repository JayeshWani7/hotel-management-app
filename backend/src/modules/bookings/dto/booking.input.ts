// import { InputType, Field, Float, Int } from '@nestjs/graphql';
// import { IsNotEmpty, IsOptional, IsUUID, IsDateString, IsNumber, Min } from 'class-validator';

// @InputType()
// export class CreateBookingInput {
//   @Field()
//   @IsDateString()
//   checkInDate: Date;

//   @Field()
//   @IsDateString()
//   checkOutDate: Date;

//   @Field(() => Int)
//   @IsNumber()
//   @Min(1)
//   numberOfGuests: number;

//   @Field({ nullable: true })
//   @IsOptional()
//   specialRequests?: string;

//   @Field()
//   @IsUUID()
//   roomId: string;
// }

// @InputType()
// export class UpdateBookingInput {
//   @Field({ nullable: true })
//   @IsOptional()
//   @IsDateString()
//   checkInDate?: Date;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsDateString()
//   checkOutDate?: Date;

//   @Field(() => Int, { nullable: true })
//   @IsOptional()
//   @IsNumber()
//   @Min(1)
//   numberOfGuests?: number;

//   @Field({ nullable: true })
//   @IsOptional()
//   specialRequests?: string;

//   @Field({ nullable: true })
//   @IsOptional()
//   notes?: string;
// }

// @InputType()
// export class CancelBookingInput {
//   @Field()
//   @IsNotEmpty()
//   cancellationReason: string;
// }

// date type of checkInDate and checkOutDate is changed 

import { InputType, Field, Int, ObjectType, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID, IsISO8601, Min, IsInt } from 'class-validator';

@InputType()
export class CreateBookingInput {
  @Field()
  @IsISO8601()
  checkInDate: string;

  @Field()
  @IsISO8601()
  checkOutDate: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  numberOfGuests: number;

  @Field({ nullable: true })
  @IsOptional()
  specialRequests?: string;

  @Field()
  @IsUUID()
  roomId: string;
}

@InputType()
export class UpdateBookingInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsISO8601()
  checkInDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsISO8601()
  checkOutDate?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  numberOfGuests?: number;

  @Field({ nullable: true })
  @IsOptional()
  specialRequests?: string;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}

@InputType()
export class CancelBookingInput {
  @Field()
  @IsNotEmpty()
  cancellationReason: string;
}


@ObjectType()
export class UserDashboardStats {
  @Field(() => Int)
  upcomingBookings: number;

  @Field(() => Int)
  completedBookings: number;

  @Field(() => Float)
  totalSpent: number;
}