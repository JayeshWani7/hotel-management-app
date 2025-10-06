import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsEmail, IsArray, IsNumber, Min, Max } from 'class-validator';

@InputType()
export class CreateHotelInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsNotEmpty()
  address: string;

  @Field()
  @IsNotEmpty()
  city: string;

  @Field()
  @IsNotEmpty()
  state: string;

  @Field()
  @IsNotEmpty()
  country: string;

  @Field()
  @IsNotEmpty()
  postalCode: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;

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
  policies?: string;

  @Field({ nullable: true })
  @IsOptional()
  checkInTime?: string;

  @Field({ nullable: true })
  @IsOptional()
  checkOutTime?: string;
}

@InputType()
export class UpdateHotelInput {
  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  state?: string;

  @Field({ nullable: true })
  @IsOptional()
  country?: string;

  @Field({ nullable: true })
  @IsOptional()
  postalCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;
  

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
  policies?: string;

  @Field({ nullable: true })
  @IsOptional()
  checkInTime?: string;

  @Field({ nullable: true })
  @IsOptional()
  checkOutTime?: string;

  @Field({ nullable: true })
  @IsOptional()
  isActive?: boolean;
}