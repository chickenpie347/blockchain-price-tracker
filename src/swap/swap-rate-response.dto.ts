import { ApiProperty } from '@nestjs/swagger';

export class SwapRateResponseDto {
  @ApiProperty({ example: 0.5, description: 'Amount of BTC received for the swapped ETH' })
  btcAmount: number;

  @ApiProperty({
    type: Object,
    description: 'Fees involved in the swap',
  })
  fee: {
    eth: number; // Fee in ETH
    usd: number; // Fee in USD
  };
}
