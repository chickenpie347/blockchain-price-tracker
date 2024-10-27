import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Price } from './price.entity';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
  ) {}

  @Cron('0 */5 * * * *')
  async fetchPrices() {
    console.log('Cron to fetch prices triggered');
    const ethPrice = await this.getPriceFromAPI('ethereum');
    const polygonPrice = await this.getPriceFromAPI('polygon');

    await this.savePrice('ethereum', ethPrice, new Date());
    await this.savePrice('polygon', polygonPrice,  new Date());
  }

  // Fetches the prices for Ethereum and Polygon for the last 24 hours, if stored
  async getPricesForLast24Hours() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Query prices for each hour within the past 24 hours, grouped by chain
    const prices = await this.priceRepository
      .createQueryBuilder('price')
      .select(['price.chain', 'price.price', 'price.createdAt'])
      .where('price.createdAt >= :oneDayAgo', { oneDayAgo })
      .orderBy('price.chain', 'ASC') // Group by chain first
      .addOrderBy('price.createdAt', 'ASC')
      .getMany();

    // Filter prices to keep only one entry per hour for each chain
    const hourlyPrices: Price[] = [];
    const lastHour = { ethereum: null, polygon: null };

    for (const price of prices) {
      const chain = price.chain.toLowerCase();
      const priceHour = price.createdAt.getHours();

      if (priceHour !== lastHour[chain]) {
        hourlyPrices.push(price);
        lastHour[chain] = priceHour;
      }
    }

    return hourlyPrices;
  }


  private async getPriceFromAPI(chain: string): Promise<number> {
    const moralisApiKey = process.env.MORALIS_API_KEY;
    var token = "";
    if (chain == "polygon"){
      token = "0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6"; // Tokem address for Moralis API
    }
    else if (chain == "ethereum"){
      token = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"; // Tokem address for Moralis API
    }
    else {
      console.error("Chain not provided.");
      throw new Error("Chain not provided.");
    }

    const response = await axios.get(`https://deep-index.moralis.io/api/v2.2/erc20/${token}/price?chain=eth`, {
      headers: {
          'accept': 'application/json',
          'X-API-KEY': moralisApiKey
        }
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => console.error(err));

    return response.usdPrice;
  }

  private async savePrice(chain: string, price: number, createdAt: Date) {
    const newPrice = this.priceRepository.create({ chain, price, createdAt });
    await this.priceRepository.save(newPrice);
  }
}
