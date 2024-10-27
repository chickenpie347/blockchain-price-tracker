import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SwapRateDto {
  @ApiProperty({ example: 1, description: 'Amount of ETH to swap' })
  @IsNumber()
  @Min(0.0001, { message: 'Amount must be greater than 0.' })
  ethAmount: number;
}

