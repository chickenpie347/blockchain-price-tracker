import { IsString, IsEmail, IsDecimal, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'ethereum', description: 'The blockchain to set an alert on' })
  chain: string;       // e.g., 'ethereum' or 'polygon'

  @IsDecimal()
  @ApiProperty({ example: 1000, description: 'The price to trigger the alert' })
  dollar: number; // The price the user wants to be alerted at

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@example.com', description: 'Email to send the alert to' })
  email: string;       // The email where the alert should be sent
}
