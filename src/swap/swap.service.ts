import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SwapRateResponseDto } from './swap-rate-response.dto';
import { firstValueFrom } from 'rxjs';

export interface SwapRate {
    btcAmount: number;
    fee: {
      eth: number;
      usd: number;
    };
  }
  

@Injectable()
export class SwapService {
  private readonly feePercentage = 0.03;

  constructor(private readonly httpService: HttpService) {}

  async getSwapRate(ethAmount: number): Promise<SwapRateResponseDto> {
    if (ethAmount == null || isNaN(ethAmount) || ethAmount <= 0) {
        throw new Error("Please provide a valid amount greater than 0.");
    }
    const ethPriceInUsd = await this.getPrice('1027'); // Use CoinMarketCap IDs for ETH and BTC with CMC API
    const btcPriceInUsd = await this.getPrice('1');

    // Calculate the total ETH value in USD
    const ethValueInUsd = ethAmount * ethPriceInUsd;

    // Calculate how much BTC can be obtained
    const btcAmount = ethValueInUsd / btcPriceInUsd;

    // Calculate fees in ETH and USD
    const feeEth = ethAmount * this.feePercentage;
    const feeUsd = feeEth * ethPriceInUsd;

    return {
      btcAmount,
      fee: {
        eth: feeEth,
        usd: feeUsd,
      },
    };
  }

  private async getPrice(symbol: string): Promise<number> {
    const cmcApiKey = process.env.CMC_API_KEY;
    const apiUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${symbol}&CMC_PRO_API_KEY=${cmcApiKey}`;
    const response = await firstValueFrom(this.httpService.get(apiUrl));
    //console.log (response.data);
    return response.data.data[symbol].quote.USD.price;
  }

}
