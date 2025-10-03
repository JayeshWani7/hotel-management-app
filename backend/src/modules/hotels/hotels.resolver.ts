import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Hotel } from './entities/hotel.entity';
import { HotelsService } from './hotels.service';
import { CreateHotelInput, UpdateHotelInput } from './dto/hotel.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Resolver(() => Hotel)
export class HotelsResolver {
  constructor(private readonly hotelsService: HotelsService) {}

  @Mutation(() => Hotel)
  @UseGuards(JwtAuthGuard)
  async createHotel(
    @Args('createHotelInput') createHotelInput: CreateHotelInput,
  ): Promise<Hotel> {
    return this.hotelsService.create(createHotelInput);
  }

  @Query(() => [Hotel])
  async getHotels(): Promise<Hotel[]> {
    return this.hotelsService.findAll();
  }

  @Query(() => Hotel)
  async getHotel(@Args('id') id: string): Promise<Hotel> {
    return this.hotelsService.findOne(id);
  }

  @Query(() => [Hotel])
  async getHotelsByCity(@Args('city') city: string): Promise<Hotel[]> {
    return this.hotelsService.findByCity(city);
  }

  @Query(() => [Hotel])
  async searchHotels(@Args('query') query: string): Promise<Hotel[]> {
    return this.hotelsService.searchHotels(query);
  }

  @Mutation(() => Hotel)
  @UseGuards(JwtAuthGuard)
  async updateHotel(
    @Args('id') id: string,
    @Args('updateHotelInput') updateHotelInput: UpdateHotelInput,
  ): Promise<Hotel> {
    return this.hotelsService.update(id, updateHotelInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteHotel(@Args('id') id: string): Promise<boolean> {
    return this.hotelsService.remove(id);
  }
}