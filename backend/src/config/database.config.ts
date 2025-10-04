import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

// Import entities
import { User } from '../modules/users/entities/user.entity';
import { Hotel } from '../modules/hotels/entities/hotel.entity';
import { Room } from '../modules/rooms/entities/room.entity';
import { Booking } from '../modules/bookings/entities/booking.entity';
import { Payment } from '../modules/payments/entities/payment.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USERNAME', 'postgres'),
      password: this.configService.get<string>('DB_PASSWORD', 'password'),
      database: this.configService.get<string>('DB_DATABASE', 'hotel_management'),
      entities: [User, Hotel, Room, Booking, Payment],
      migrations: ['dist/migrations/*.js'],
      synchronize: this.configService.get<string>('NODE_ENV') === 'development',
      logging: this.configService.get<string>('NODE_ENV') === 'development',
    };
  }
}

// Data source configuration for migrations
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'hotel_management',
  entities: [User, Hotel, Room, Booking, Payment],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
};

export const AppDataSource = new DataSource(dataSourceOptions);