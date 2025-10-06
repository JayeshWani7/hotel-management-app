import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Hotel } from './entities/hotel.entity';
import { HotelsService } from './hotels.service';
import { CreateHotelInput, UpdateHotelInput } from './dto/hotel.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { validate } from 'class-validator';

@Resolver(() => Hotel)
export class HotelsResolver {
  constructor(private readonly hotelsService: HotelsService) {}

  @Mutation(() => Hotel)
  @UseGuards(JwtAuthGuard)
  async createHotel(
    @Args('createHotelInput') createHotelInput: CreateHotelInput,
  ): Promise<Hotel> {
    const validationErrors = await validate(createHotelInput);
    if (validationErrors.length > 0) {
      throw new BadRequestException('Required fields are missing or invalid');
    }
    try {
      return await this.hotelsService.create(createHotelInput);
    } catch (error) {
      throw new BadRequestException('Required fields are missing or invalid');
    }
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
    const validationErrors = await validate(updateHotelInput);
    if (validationErrors.length > 0) {
      throw new BadRequestException('Invalid input data');
    }
  
    const hotel = await this.hotelsService.findOne(id);
    if (!hotel) {
      throw new BadRequestException(`Hotel with id ${id} not found`);
    }
  
    return this.hotelsService.update(id, updateHotelInput);
  }
  

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteHotel(@Args('id') id: string): Promise<boolean> {
    const hotel = await this.hotelsService.findOne(id); 
  if (!hotel) {
    throw new BadRequestException(`Hotel with id ${id} not found`); 
  }
    return this.hotelsService.remove(id);
  }
}