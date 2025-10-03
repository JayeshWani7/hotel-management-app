import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { HotelsService } from './hotels.service';
import { HotelsResolver } from './hotels.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel])],
  providers: [HotelsService, HotelsResolver],
  exports: [HotelsService],
})
export class HotelsModule {}