import { Controller, Post, Body } from '@nestjs/common';
import { SwapService } from './swap.service';
import { SwapRateDto } from './swap-rate.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Swap')
@Controller('swap')
export class SwapController {

constructor(private readonly swapService: SwapService) {}

  @Post('rate')
  @ApiOperation({ summary: 'Get the swap rate for ETH' })
  @ApiResponse({
    status: 200,
    description: 'Returns the BTC equivalent and fees for a given ETH amount',
    schema: {
      example: {
        btcAmount: 0.0235,
        totalFee: {
          eth: 0.003,
          dollar: 8.4,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid ETH amount' })
    async getSwapRate(@Body() swapRateDto: SwapRateDto) {
        const { ethAmount } = swapRateDto;
        return await this.swapService.getSwapRate(ethAmount);
    }
}
