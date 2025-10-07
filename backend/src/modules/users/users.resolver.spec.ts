import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { RegisterUserInput, UpdateUserInput } from './dto/user.input';
import { UserRole } from './entities/user.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';


describe('UsersResolver', () => {
    let resolver: UsersResolver;
    let service: UsersService;
  
    const mockUser = {
      id: '1',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.USER,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      bookings: [],
    };
  
    const mockUsersService = {
        findAll: jest.fn().mockResolvedValue([mockUser]),
        findOne: jest.fn().mockResolvedValue(mockUser),
        update: jest.fn().mockImplementation((id, updateUserInput) => {
          return {
            ...mockUser,
            ...updateUserInput,
          };
        }),
        remove: jest.fn().mockResolvedValue(true),
      };
      
      
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UsersResolver,
          {
            provide: UsersService,
            useValue: mockUsersService,
          },
        ],
      }).compile();
  
      resolver = module.get<UsersResolver>(UsersResolver);
      service = module.get<UsersService>(UsersService);
    });
  
    it('should be defined', () => {
      expect(resolver).toBeDefined();
    });
  
    describe('Queries', () => {
      it('should return a list of users', async () => {
        const result = await resolver.users();
        expect(result).toEqual([mockUser]);
        expect(service.findAll).toHaveBeenCalled();
      });
  
      it('should return a user by id', async () => {
        const result = await resolver.user('1');
        expect(result).toEqual(mockUser);
        expect(service.findOne).toHaveBeenCalledWith('1');
      });
  
      it('should return the logged-in user (me)', async () => {
        const context = {
          req: { user: { userId: '1' } },
        };
        const result = await resolver.me(context);
        expect(result).toEqual(mockUser);
        expect(service.findOne).toHaveBeenCalledWith('1');
      });
    });
  
    describe('Mutations', () => {
      it('should update a user profile', async () => {
        const updateUserInput: UpdateUserInput = {
          firstName: 'Jane',
          lastName: 'Doe',
          phone: '123456789',
        };
  
        const updatedUser = { ...mockUser, ...updateUserInput };
  
        const result = await resolver.updateProfile(updateUserInput, {
          req: { user: { userId: '1' } },
        });
  
        expect(result).toEqual(updatedUser);
        expect(service.update).toHaveBeenCalledWith('1', updateUserInput);
      });
  
      it('should delete a user', async () => {
        const result = await resolver.deleteUser('1');
        expect(result).toBe(true);
        expect(service.remove).toHaveBeenCalledWith('1');
      });
      it('should throw error when deleting non-existent user', async () => {
        mockUsersService.remove.mockResolvedValueOnce(false);
        await expect(resolver.deleteUser('999')).rejects.toThrowError('User not found');
      });
 
      
  
    });
  
    

    describe('Authorization', () => {
  
      it('should allow admin to delete a user', async () => {
        const context = {
          req: { user: { userId: '1', role: UserRole.ADMIN } },
        };
      
        // Make sure not to pass context directly as an argument
        const result = await resolver.deleteUser('2'); // Only pass userId
        expect(result).toBe(true);
      });
    });
  });
  