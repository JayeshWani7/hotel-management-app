import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingInput, UpdateBookingInput, CancelBookingInput } from './dto/booking.input';
import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private roomsService: RoomsService,
    private usersService: UsersService,
    private paymentService: PaymentsService,
  ) {}

  async create(createBookingInput: CreateBookingInput, userId: string): Promise<Booking> {
    // Verify user exists
    await this.usersService.findOne(userId);

    // Verify room exists
    const room = await this.roomsService.findOne(createBookingInput.roomId);

    // Validate dates
    if (new Date(createBookingInput.checkInDate) >= new Date(createBookingInput.checkOutDate)) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }

    // Check room availability
    const isAvailable = await this.isRoomAvailable(
      createBookingInput.roomId,
      new Date(createBookingInput.checkInDate),
      new Date(createBookingInput.checkOutDate),
    );

    if (!isAvailable) {
      throw new BadRequestException('Room is not available for the selected dates');
    }

    // Calculate total amount
    const checkIn = new Date(createBookingInput.checkInDate);
    const checkOut = new Date(createBookingInput.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = nights * room.pricePerNight;

    const booking = this.bookingsRepository.create({
      ...createBookingInput,
      userId,
      totalAmount,
      checkInDate: checkIn,
      checkOutDate: checkOut,
    });

    const savedBooking = await this.bookingsRepository.save(booking);
     return this.bookingsRepository.findOne({
      where: { id: savedBooking.id },
      relations: ['room', 'room.hotel', 'user', 'payment'],
    });
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      relations: ['user', 'room', 'room.hotel', 'payment'],
    });
  }

  async findByUser(userId: string): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { userId },
      relations: ['user', 'room', 'room.hotel', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['user', 'room', 'room.hotel', 'payment'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }
  async findOneByLink(linkId: string): Promise<Booking> {
    const payment = await this.paymentService.findOne(linkId);

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${linkId} not found`);
    }
    const booking = await this.bookingsRepository.findOne({
      where: {id : payment?.bookingId },
      relations: ['user', 'room', 'room.hotel', 'payment'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${linkId} not found`);
    }

    return booking;
  }

  async update(id: string, updateBookingInput: UpdateBookingInput): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Can only update pending bookings');
    }

    // If dates are being updated, check availability
    if (updateBookingInput.checkInDate || updateBookingInput.checkOutDate) {
      const newCheckIn = updateBookingInput.checkInDate 
        ? new Date(updateBookingInput.checkInDate) 
        : booking.checkInDate;
      const newCheckOut = updateBookingInput.checkOutDate 
        ? new Date(updateBookingInput.checkOutDate) 
        : booking.checkOutDate;

      if (newCheckIn >= newCheckOut) {
        throw new BadRequestException('Check-out date must be after check-in date');
      }

      const isAvailable = await this.isRoomAvailable(
        booking.roomId,
        newCheckIn,
        newCheckOut,
        id, // Exclude current booking from availability check
      );

      if (!isAvailable) {
        throw new BadRequestException('Room is not available for the updated dates');
      }

      // Recalculate total amount if dates changed
      const room = await this.roomsService.findOne(booking.roomId);
      const nights = Math.ceil((newCheckOut.getTime() - newCheckIn.getTime()) / (1000 * 60 * 60 * 24));
      booking.totalAmount = nights * room.pricePerNight;
    }

    Object.assign(booking, updateBookingInput);
    return this.bookingsRepository.save(booking);
  }

  async cancel(id: string, cancelBookingInput: CancelBookingInput): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed booking');
    }

    booking.status = BookingStatus.CANCELLED;
    booking.cancellationReason = cancelBookingInput.cancellationReason;
    booking.cancellationDate = new Date();

    return this.bookingsRepository.save(booking);
  }

  async remove(id: string): Promise<boolean> {
    const booking = await this.findOne(id);
    await this.bookingsRepository.remove(booking);
    return true;
  }

  private async isRoomAvailable(
    roomId: string,
    checkInDate: Date,
    checkOutDate: Date,
    excludeBookingId?: string,
  ): Promise<boolean> {
    const query = this.bookingsRepository
      .createQueryBuilder('booking')
      .where('booking.roomId = :roomId', { roomId })
      .andWhere('booking.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: [BookingStatus.CANCELLED],
      })
      .andWhere(
        'NOT (booking.checkOutDate <= :checkIn OR booking.checkInDate >= :checkOut)',
        {
          checkIn: checkInDate,
          checkOut: checkOutDate,
        }
      );

    if (excludeBookingId) {
      query.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }

    const conflictingBookings = await query.getCount();
    return conflictingBookings === 0;
  }
}