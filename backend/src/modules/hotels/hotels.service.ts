import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { CreateHotelInput, UpdateHotelInput } from './dto/hotel.input';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private hotelsRepository: Repository<Hotel>,
  ) {}

  async create(createHotelInput: CreateHotelInput): Promise<Hotel> {
    const hotel = this.hotelsRepository.create(createHotelInput);
    return this.hotelsRepository.save(hotel);
  }

  async findAll(): Promise<Hotel[]> {
    return this.hotelsRepository.find({
      where: { isActive: true },
      relations: ['rooms'],
    });
  }

  async findOne(id: string): Promise<Hotel> {
    const hotel = await this.hotelsRepository.findOne({
      where: { id, isActive: true },
      relations: ['rooms'],
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }

    return hotel;
  }

  async update(id: string, updateHotelInput: UpdateHotelInput): Promise<Hotel> {
    const hotel = await this.findOne(id);
    if (!hotel) {
      throw new NotFoundException(`Hotel with id ${id} not found`);
    }
    Object.assign(hotel, updateHotelInput);
    return this.hotelsRepository.save(hotel);
  }

  async remove(id: string): Promise<boolean> {
    const hotel = await this.hotelsRepository.findOne({ where: { id } });
    if (!hotel) {
      throw new NotFoundException(`Hotel with id ${id} not found`);
    }
    hotel.isActive = false;
    await this.hotelsRepository.remove(hotel);
    return true;
  }

  async findByCity(city: string): Promise<Hotel[]> {
    return this.hotelsRepository.find({
      where: { 
        city: city.toLowerCase(),
        isActive: true 
      },
      relations: ['rooms'],
    });
  }

  async searchHotels(query: string): Promise<Hotel[]> {
    return this.hotelsRepository.createQueryBuilder('hotel')
      .where('hotel.isActive = :isActive', { isActive: true })
      .andWhere(
        '(LOWER(hotel.name) LIKE LOWER(:query) OR LOWER(hotel.city) LIKE LOWER(:query) OR LOWER(hotel.description) LIKE LOWER(:query))',
        { query: `%${query}%` }
      )
      .leftJoinAndSelect('hotel.rooms', 'rooms')
      .getMany();
  }
}