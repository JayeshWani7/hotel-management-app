import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room, RoomStatus } from './entities/room.entity';
import { CreateRoomInput, UpdateRoomInput } from './dto/room.input';
import { HotelsService } from '../hotels/hotels.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    private hotelsService: HotelsService,
  ) {}

  async create(createRoomInput: CreateRoomInput): Promise<Room> {
    // Verify hotel exists
    await this.hotelsService.findOne(createRoomInput.hotelId);

    // Check if room number already exists in this hotel
    const existingRoom = await this.roomsRepository.findOne({
      where: {
        roomNumber: createRoomInput.roomNumber,
        hotelId: createRoomInput.hotelId,
      },
    });

    if (existingRoom) {
      throw new BadRequestException(
        'Room number already exists in this hotel'
      );
    }

    const room = this.roomsRepository.create(createRoomInput);
    return this.roomsRepository.save(room);
  }

  async findAll(): Promise<Room[]> {
    return this.roomsRepository.find({
      where: { isActive: true },
      relations: ['hotel', 'bookings'],
    });
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomsRepository.findOne({
      where: { id, isActive: true },
      relations: ['hotel', 'bookings'],
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return room;
  }

  async findByHotel(hotelId: string): Promise<Room[]> {
    // Verify hotel exists
    await this.hotelsService.findOne(hotelId);

    return this.roomsRepository.find({
      where: { hotelId, isActive: true },
      relations: ['hotel', 'bookings'],
    });
  }

  async findAvailableRooms(
    hotelId: string,
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<Room[]> {
    return this.roomsRepository
  .createQueryBuilder('room')
  .where('room.hotelId = :hotelId', { hotelId })
  .andWhere('room.isActive = :isActive', { isActive: true })
  .andWhere('room.status = :status', { status: RoomStatus.AVAILABLE })
  .setParameters({
    checkIn: checkInDate,
    checkOut: checkOutDate,
  })
  .getMany();

  }

  async update(id: string, updateRoomInput: UpdateRoomInput): Promise<Room> {
    const room = await this.findOne(id);

    // If updating room number, check for conflicts
    if (updateRoomInput.roomNumber && updateRoomInput.roomNumber !== room.roomNumber) {
      const existingRoom = await this.roomsRepository.findOne({
        where: {
          roomNumber: updateRoomInput.roomNumber,
          hotelId: room.hotelId,
        },
      });

      if (existingRoom) {
        throw new BadRequestException(
          'Room number already exists in this hotel'
        );
      }
    }

    Object.assign(room, updateRoomInput);
    return this.roomsRepository.save(room);
  }

  async remove(id: string): Promise<boolean> {
    const room = await this.findOne(id);
    room.isActive = false;
    await this.roomsRepository.save(room);
    return true;
  }
}