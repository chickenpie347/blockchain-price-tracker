import { Controller, Get } from '@nestjs/common';
import { PriceService } from './price.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Price')
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('hourly-prices')
  @ApiOperation({ summary: 'Get the last 24 hours prices for ETH and Polygon' })
  @ApiResponse({
    status: 200,
    description: 'Returns hourly prices for Ethereum and Polygon over the last 24 hours',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          chain: { type: 'string', example: 'ethereum' },
          price: { type: 'number', example: 1820.5 },
          createdAt: { type: 'string', example: '2024-10-27T00:00:00.000Z' },
        },
      },
    },
  })
  async getHourlyPrices() {
    return await this.priceService.getPricesForLast24Hours();
  }
}
