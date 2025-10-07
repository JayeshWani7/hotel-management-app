import { Test, TestingModule } from '@nestjs/testing';
import { HotelsResolver } from './hotels.resolver';
import { HotelsService } from './hotels.service';
import { Hotel } from './entities/hotel.entity';
import { CreateHotelInput, UpdateHotelInput } from './dto/hotel.input';
import { UserRole } from '../users/entities/user.entity'; 

describe('HotelsResolver', () => {
  let resolver: HotelsResolver;
  let service: HotelsService;


  const mockHotel: Hotel = {
    id: '1',
    name: "Hotel ABC",
    description: "A great hotel",
    address: "123 Street",
    city: "City",
    state: "State",
    country: "Country",
    postalCode: "12345",
    email: "hotel@example.com",
    latitude: 12.34,
    longitude: 56.78,
    rating: 4.5,
    amenities: ["WiFi", "Pool"],
    // images: ["image1.jpg", "image2.jpg"],
    isActive: true,
    policies: "No pets",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    createdAt: new Date(),
    updatedAt: new Date(),
    rooms: [],
  };

  const mockHotelsService = {
    create: jest.fn().mockResolvedValue(mockHotel),
    findAll: jest.fn().mockResolvedValue([mockHotel]),
    findOne: jest.fn().mockResolvedValue(mockHotel),
    findByCity: jest.fn().mockResolvedValue([mockHotel]),
    searchHotels: jest.fn().mockResolvedValue([mockHotel]),
    update: jest.fn().mockImplementation((id, updateHotelInput) => {
        return { ...mockHotel, ...updateHotelInput };
      }),
    remove: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HotelsResolver,
        {
          provide: HotelsService,
          useValue: mockHotelsService,
        },
      ],
    }).compile();

    resolver = module.get<HotelsResolver>(HotelsResolver);
    service = module.get<HotelsService>(HotelsService);
  });
  


  

  it('should throw an error when required fields are missing', async () => {
    const createHotelInput: CreateHotelInput = {
      name: '',
      description: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    };

    await expect(resolver.createHotel(createHotelInput)).rejects.toThrowError();
    expect(service.create).not.toHaveBeenCalled();
  });


  it('should get all hotels', async () => {
    const result = await resolver.getHotels();
    expect(result).toEqual([mockHotel]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should get a hotel by ID', async () => {
    const result = await resolver.getHotel('1');
    expect(result).toEqual(mockHotel);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should get hotels by city', async () => {
    const result = await resolver.getHotelsByCity('City');
    expect(result).toEqual([mockHotel]);
    expect(service.findByCity).toHaveBeenCalledWith('City');
  });

  it('should search hotels', async () => {
    const result = await resolver.searchHotels('hotel');
    expect(result).toEqual([mockHotel]);
    expect(service.searchHotels).toHaveBeenCalledWith('hotel');
  });


  it('should delete a hotel successfully', async () => {
    const result = await resolver.deleteHotel('1');
    expect(result).toBe(true);
    expect(service.remove).toHaveBeenCalledWith('1');
  });




 

  it('should not update with invalid rating', async () => {
    const updateHotelInput: UpdateHotelInput = { rating: 6 };

    await expect(resolver.updateHotel('1', updateHotelInput)).rejects.toThrowError();
    expect(service.update).not.toHaveBeenCalled();
  });

  it('should return an empty array when no hotels match the search', async () => {
    mockHotelsService.searchHotels.mockResolvedValueOnce([]); 

    const result = await resolver.searchHotels('nonexistent');
    expect(result).toEqual([]);
    expect(service.searchHotels).toHaveBeenCalledWith('nonexistent');
  });

});
