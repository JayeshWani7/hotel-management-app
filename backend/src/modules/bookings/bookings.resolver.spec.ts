import { BookingsResolver } from './bookings.resolver';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Booking, BookingStatus } from './entities/booking.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, NotFoundException } from '@nestjs/common';

jest.mock('../../common/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn(() => true),
  })),
}));

describe('BookingsResolver', () => {
  let resolver: BookingsResolver;
  let service: jest.Mocked<BookingsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsResolver,
        {
          provide: BookingsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            cancel: jest.fn(),
            findByUser: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<BookingsResolver>(BookingsResolver);
    service = module.get<BookingsService>(BookingsService) as jest.Mocked<BookingsService>;
  });
  
  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      const createBookingInput = {
        checkInDate: '2025-12-01T14:00:00Z',
        checkOutDate: '2025-12-05T10:00:00Z',
        numberOfGuests: 2,
        specialRequests: 'Late check-in',
        roomId: 'room-uuid',
      };

      const userId = 'user-uuid'; // Mocked user
      const createdBooking: Booking = { 
        ...createBookingInput, 
        id: 'booking-uuid', 
        userId, 
        totalAmount: 200.0, 
        checkInDate: new Date(createBookingInput.checkInDate),
        checkOutDate: new Date(createBookingInput.checkOutDate),
        status: BookingStatus.PENDING, 
        createdAt: new Date(), 
        updatedAt: new Date(),
        user: undefined, // or provide a mock user object if needed
        room: undefined, // or provide a mock room object if needed
      };

      service.create.mockResolvedValue(createdBooking);

      const result = await resolver.createBooking(createBookingInput, { req: { user: { userId } } });

      expect(result).toEqual(createdBooking);
      expect(service.create).toHaveBeenCalledWith(createBookingInput, userId);
    });

   

  });
  

  describe('updateBooking', () => {
    it('should update a booking successfully', async () => {
      const updateBookingInput = { specialRequests: 'Changed request' };
      const updatedBooking: Booking = {
        ...updateBookingInput,
        id: 'booking-uuid',
        checkInDate: new Date(),
        checkOutDate: new Date(),
        numberOfGuests: 2,
        userId: 'user-uuid',
        roomId: 'room-uuid',
        user: undefined,
        room: undefined,
        totalAmount: 200.0,
        status: BookingStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
       

      service.update.mockResolvedValue(updatedBooking);

      const result = await resolver.updateBooking('booking-uuid', updateBookingInput);

      expect(result).toEqual(updatedBooking);
      expect(service.update).toHaveBeenCalledWith('booking-uuid', updateBookingInput);
    });

    
      
  });

  describe('cancelBooking', () => {
    it('should cancel a booking successfully', async () => {
      const cancelBookingInput = { cancellationReason: 'Customer requested cancellation' };
      const canceledBooking: Booking = {
        id: 'booking-uuid',
        checkInDate: new Date(),
        checkOutDate: new Date(),
        numberOfGuests: 2,
        userId: 'user-uuid',
        roomId: 'room-uuid',
        user: { id: 'user-uuid' } as any,
        room: { id: 'room-uuid' } as any,
        totalAmount: 200.0,
        status: BookingStatus.CANCELLED,
        cancellationReason: cancelBookingInput.cancellationReason,
        cancellationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
        

      service.cancel.mockResolvedValue(canceledBooking);

      const result = await resolver.cancelBooking('booking-uuid', cancelBookingInput);

      expect(result).toEqual(canceledBooking);
      expect(service.cancel).toHaveBeenCalledWith('booking-uuid', cancelBookingInput);
    });


  });

  describe('getBookings', () => {
    it('should return all bookings for the user', async () => {
      const userBookings = [
        { id: 'booking-uuid-1', userId: 'user-uuid', checkInDate: new Date(), checkOutDate: new Date() },
        { id: 'booking-uuid-2', userId: 'user-uuid', checkInDate: new Date(), checkOutDate: new Date() },
      ];

      // Add missing Booking properties to match the Booking type
      const completeUserBookings: Booking[] = [
        {
          id: 'booking-uuid-1',
          userId: 'user-uuid',
          checkInDate: userBookings[0].checkInDate,
          checkOutDate: userBookings[0].checkOutDate,
          numberOfGuests: 2,
          roomId: 'room-uuid-1',
          user: { id: 'user-uuid' } as any,
          room: { id: 'room-uuid-1' } as any,
          totalAmount: 100.0,
          status: BookingStatus.CONFIRMED,
          cancellationReason: null,
          cancellationDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'booking-uuid-2',
          userId: 'user-uuid',
          checkInDate: userBookings[1].checkInDate,
          checkOutDate: userBookings[1].checkOutDate,
          numberOfGuests: 2,
          roomId: 'room-uuid-2',
          user: { id: 'user-uuid' } as any,
          room: { id: 'room-uuid-2' } as any,
          totalAmount: 150.0,
          status: BookingStatus.CONFIRMED,
          cancellationReason: null,
          cancellationDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      service.findByUser.mockResolvedValue(completeUserBookings);

      const result = await resolver.getBookings('user-uuid', { req: { user: { userId: 'user-uuid' } } });

      expect(result).toEqual(completeUserBookings);
      expect(service.findByUser).toHaveBeenCalledWith('user-uuid');
    });

    it('should return all bookings if no userId is provided', async () => {
      const allBookings = [
        { id: 'booking-uuid-1', userId: 'user-uuid', checkInDate: new Date(), checkOutDate: new Date() },
        { id: 'booking-uuid-2', userId: 'user-uuid', checkInDate: new Date(), checkOutDate: new Date() },
      ];

      // Add missing Booking properties to match the Booking type
      const completeAllBookings: Booking[] = [
        {
          id: 'booking-uuid-1',
          userId: 'user-uuid',
          checkInDate: allBookings[0].checkInDate,
          checkOutDate: allBookings[0].checkOutDate,
          numberOfGuests: 2,
          roomId: 'room-uuid-1',
          user: { id: 'user-uuid' } as any,
          room: { id: 'room-uuid-1' } as any,
          totalAmount: 100.0,
          status: BookingStatus.CONFIRMED,
          cancellationReason: null,
          cancellationDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'booking-uuid-2',
          userId: 'user-uuid',
          checkInDate: allBookings[1].checkInDate,
          checkOutDate: allBookings[1].checkOutDate,
          numberOfGuests: 2,
          roomId: 'room-uuid-2',
          user: { id: 'user-uuid' } as any,
          room: { id: 'room-uuid-2' } as any,
          totalAmount: 150.0,
          status: BookingStatus.CONFIRMED,
          cancellationReason: null,
          cancellationDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      service.findByUser.mockResolvedValue(completeAllBookings);

      const result = await resolver.getBookings(undefined, { req: { user: { userId: 'user-uuid' } } });

      expect(result).toEqual(completeAllBookings);
      expect(service.findByUser).toHaveBeenCalledWith('user-uuid');
    });
  });

  describe('deleteBooking', () => {
    it('should delete a booking successfully', async () => {
      service.remove.mockResolvedValue(true);

      const result = await resolver.deleteBooking('booking-uuid');

      expect(result).toBe(true);
      expect(service.remove).toHaveBeenCalledWith('booking-uuid');
    });

  
  });
});
