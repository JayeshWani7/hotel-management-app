import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class InitiatePaymentResponseDto {

  @Field()
  paymentLink: String

//   orderId: string;

//   paymentSessionId: string;

//   @Field({ nullable: true })
//   orderToken?: string | null; // Use null instead of undefined
}

