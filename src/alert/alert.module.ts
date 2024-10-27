import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertService } from './alert.service';
import { Alert } from './alert.entity';
import { PriceAlertController } from './price-alert.controller';
import { Price } from '../price/price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Price, Alert])],
  controllers: [PriceAlertController],
  providers: [AlertService],
  exports: [AlertService],
})
export class AlertModule {}
