import { Controller, Post, Body } from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './create-alert.dto'; // Assuming you have an alert DTO
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Alert')
@Controller('alert')
export class PriceAlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post('set-alert')
  @ApiOperation({ summary: 'Set a price alert for specific chain' })
  @ApiResponse({
    status: 201,
    description: 'Alert created successfully',
    schema: {
      example: {
        chain: 'ethereum',
        dollar: 1000,
        email: 'user@example.com',
      },
    },
  })
  async setPriceAlert(@Body() alertDto: CreateAlertDto) {
    await this.alertService.setAlert(alertDto);
  }
}
