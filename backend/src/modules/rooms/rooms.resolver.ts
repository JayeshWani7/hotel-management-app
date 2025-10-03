import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { RoomsService } from './rooms.service';
import { CreateRoomInput, UpdateRoomInput } from './dto/room.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Resolver(() => Room)
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @Mutation(() => Room)
  @UseGuards(JwtAuthGuard)
  async addRoom(
    @Args('createRoomInput') createRoomInput: CreateRoomInput,
  ): Promise<Room> {
    return this.roomsService.create(createRoomInput);
  }

  @Query(() => [Room])
  async getRooms(
    @Args('hotelId', { nullable: true }) hotelId?: string,
  ): Promise<Room[]> {
    if (hotelId) {
      return this.roomsService.findByHotel(hotelId);
    }
    return this.roomsService.findAll();
  }

  @Query(() => Room)
  async getRoom(@Args('id') id: string): Promise<Room> {
    return this.roomsService.findOne(id);
  }

  @Query(() => [Room])
  async getAvailableRooms(
    @Args('hotelId') hotelId: string,
    @Args('checkInDate') checkInDate: Date,
    @Args('checkOutDate') checkOutDate: Date,
  ): Promise<Room[]> {
    return this.roomsService.findAvailableRooms(hotelId, checkInDate, checkOutDate);
  }

  @Mutation(() => Room)
  @UseGuards(JwtAuthGuard)
  async updateRoom(
    @Args('id') id: string,
    @Args('updateRoomInput') updateRoomInput: UpdateRoomInput,
  ): Promise<Room> {
    return this.roomsService.update(id, updateRoomInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteRoom(@Args('id') id: string): Promise<boolean> {
    return this.roomsService.remove(id);
  }
}