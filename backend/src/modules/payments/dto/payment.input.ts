import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class InitiatePaymentResponseDto {
  @Field()
  orderId: string;

  @Field()
  paymentSessionId: string;

  @Field({ nullable: true })
  orderToken?: string | null; // Use null instead of undefined
}
