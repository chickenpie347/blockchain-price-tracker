import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';
import { Price } from './price.entity';
import { HttpModule } from '@nestjs/axios';  // Needed for API requests
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule, HttpModule,TypeOrmModule.forFeature([Price])],
  controllers: [PriceController],
  providers: [PriceService],
})
export class PriceModule {}
