import { Test, TestingModule } from '@nestjs/testing';
import { RoomsResolver } from './rooms.resolver';
import { RoomsService } from './rooms.service';
import { CreateRoomInput, UpdateRoomInput } from './dto/room.input';
import { Room, RoomType, RoomStatus } from './entities/room.entity';

describe('RoomsResolver', () => {
  let resolver: RoomsResolver;
  let service: RoomsService;

  beforeEach(async () => {
    const mockRoomsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByHotel: jest.fn(),
      findOne: jest.fn(),
      findAvailableRooms: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsResolver,
        { provide: RoomsService, useValue: mockRoomsService },
      ],
    }).compile();

    resolver = module.get<RoomsResolver>(RoomsResolver);
    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getRooms', () => {
    it('should return all rooms', async () => {
      const result: Room[] = [
        {
          id: '1',
          roomNumber: '101',
          type: RoomType.SINGLE,
          description: 'A cozy single room',
          pricePerNight: 100.00,
          capacity: 1,
          size: 20,
          status: RoomStatus.AVAILABLE,
          amenities: ['WiFi', 'TV'],
          images: ['image1.jpg'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          hotelId: 'hotel1',
          hotel: null,  // You can mock the hotel object if needed
          bookings: [], // Similarly, mock any bookings if required
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.getRooms()).toEqual(result);
    });
  });

  describe('addRoom', () => {
    it('should create a new room', async () => {
      const createRoomInput: CreateRoomInput = {
        roomNumber: '102',
        type: RoomType.DOUBLE,
        description: 'Spacious double room',
        pricePerNight: 150.00,
        capacity: 2,
        size: 30,
        amenities: ['WiFi', 'Air Conditioning'],
        images: ['image2.jpg'],
        hotelId: 'hotel1', // Make sure you add hotelId if it's required
      };
  
      const result: Room = {
        id: '2',
        roomNumber: '102',
        type: RoomType.DOUBLE,
        description: 'Spacious double room',
        pricePerNight: 150.00,
        capacity: 2,
        size: 30,
        status: RoomStatus.AVAILABLE, // Default status
        amenities: ['WiFi', 'Air Conditioning'],
        images: ['image2.jpg'],
        isActive: true, // This will be set automatically
        createdAt: new Date(),
        updatedAt: new Date(),
        hotelId: 'hotel1',
        hotel: null,
        bookings: [],
      };
  
      jest.spyOn(service, 'create').mockResolvedValue(result);
  
      expect(await resolver.addRoom(createRoomInput)).toEqual(result);
    });
  });
  
  
  

  describe('updateRoom', () => {
    it('should update an existing room', async () => {
      const updateRoomInput: UpdateRoomInput = {
        roomNumber: '101',
        type: RoomType.SINGLE,
        description: 'Updated description',
        pricePerNight: 120.00,
        capacity: 1,
        size: 20,
        status: RoomStatus.OCCUPIED,
        amenities: ['WiFi', 'TV', 'Fridge'],
        images: ['updated_image.jpg'],
        isActive: true,
      };

      const result: Room = {
        id: '1',
        roomNumber: '101',
        type: RoomType.SINGLE,
        description: 'Updated description',
        pricePerNight: 120.00,
        capacity: 1,
        size: 20,
        status: RoomStatus.OCCUPIED,
        amenities: ['WiFi', 'TV', 'Fridge'],
        images: ['updated_image.jpg'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        hotelId: 'hotel1',
        hotel: null,
        bookings: [],
      };

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await resolver.updateRoom('1', updateRoomInput)).toEqual(result);
    });
  });

  describe('deleteRoom', () => {
    it('should delete a room', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(true);

      expect(await resolver.deleteRoom('1')).toBe(true);
    });
  });
});
