import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { BadRequestException, NotFoundException, UseGuards, ValidationPipe } from '@nestjs/common';
import { Booking } from './entities/booking.entity';
import { BookingsService } from './bookings.service';
import { CreateBookingInput, UpdateBookingInput, CancelBookingInput } from './dto/booking.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Resolver(() => Booking)
export class BookingsResolver {
  constructor(private readonly bookingsService: BookingsService) {}

  @Mutation(() => Booking)
  @UseGuards(JwtAuthGuard)
  async createBooking(
    @Args('createBookingInput', new ValidationPipe({ exceptionFactory: (errors) => new BadRequestException(errors) })) createBookingInput: CreateBookingInput,
    @Context() context: any,
  ): Promise<Booking> {
    return this.bookingsService.create(createBookingInput, context.req.user.userId);
  }

  @Query(() => [Booking])
  @UseGuards(JwtAuthGuard)
  async getBookings(
    @Args('userId', { nullable: true }) userId?: string,
    @Context() context?: any,
  ): Promise<Booking[]> {
    if (userId) {
      return this.bookingsService.findByUser(userId);
    }
    
    // If no userId provided, return current user's bookings
    return this.bookingsService.findByUser(context.req.user.userId);
  }

  @Query(() => [Booking])
  @UseGuards(JwtAuthGuard)
  async getAllBookings(): Promise<Booking[]> {
    return this.bookingsService.findAll();
  }

  @Query(() => Booking)
  @UseGuards(JwtAuthGuard)
  async getBooking(@Args('id') id: string): Promise<Booking> {
    return this.bookingsService.findOne(id);
  }

  @Mutation(() => Booking)
  @UseGuards(JwtAuthGuard)
  async updateBooking(
    @Args('id') id: string,
    @Args('updateBookingInput') updateBookingInput: UpdateBookingInput,
  ): Promise<Booking> {
    try {
      return await this.bookingsService.update(id, updateBookingInput);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Booking not found');
      }
      throw error;
    }
  }

  @Mutation(() => Booking)
  @UseGuards(JwtAuthGuard)
  async cancelBooking(
    @Args('id') id: string,
    @Args('cancelBookingInput') cancelBookingInput: CancelBookingInput,
  ): Promise<Booking> {
    return this.bookingsService.cancel(id, cancelBookingInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteBooking(@Args('id') id: string): Promise<boolean> {
    try {
      return await this.bookingsService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Booking not found');
      }
      throw error;
    }
  }
}