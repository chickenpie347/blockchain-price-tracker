import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Price } from '../price/price.entity';
import { CreateAlertDto } from './create-alert.dto';
import { Cron } from '@nestjs/schedule';  // Cron job for scheduled tasks
import { Alert } from './alert.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,

    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>, // Store alerts in DB
  ) {}

  // Method to set price alert
  async setAlert(alertDto: CreateAlertDto) {
    const alert = new Alert();
    alert.chain = alertDto.chain;
    alert.dollar = alertDto.dollar;
    alert.email = alertDto.email;
    alert.createdAt = new Date();

    // Save alert to the database
    await this.alertRepository.save(alert);

    console.log(`Alert set for ${alert.chain} at $${alert.dollar}`);
    return { message: 'Alert has been set successfully' };
  }

  // Check price every 5 minutes
  @Cron('0 */5 * * * *')
  async checkPriceAlerts() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const prices = await this.priceRepository.find({ where: { createdAt: oneHourAgo } });

    for (const price of prices) {
      const currentPrice = await this.priceRepository.findOne({ where: { chain: price.chain }, order: { createdAt: 'DESC' } });
      // Send alerts if price increased more than 3%
      if (currentPrice.price > price.price * 1.03) {
        await this.sendEmail("hyperhire_assignment@hyperhire.in", price.chain, currentPrice.price);
      }
    }

    // Get the most recent price for each chain
    const latestPrices = await this.priceRepository
      .createQueryBuilder('price')
      .select(['price.chain', 'price.price'])
      .orderBy('price.createdAt', 'DESC')
      .getMany();

    // Retrieve all active alerts
    const alerts = await this.alertRepository.find();

    // Iterate over each alert and check if the price condition is met
    for (const alert of alerts) {
      const currentPrice = latestPrices.find((p) => p.chain === alert.chain);

      if (currentPrice && currentPrice.price >= alert.dollar) {
        await this.sendEmail(alert.email, alert.chain, currentPrice.price);
        
        // Delete or deactivate the alert after sending
        await this.alertRepository.delete(alert.id);
        console.log(`Alert triggered for user ${alert.email} for ${alert.chain} at $${currentPrice.price}`);
      }
    }


  }

  private async sendEmail(email: string, chain: string, price: number) {
    const email_user = process.env.EMAIL_USER;
    const email_password = process.env.EMAIL_PASSWORD;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email_user,
        pass: email_password,
      },
    });

    await transporter.sendMail({
      from: '"Blockchain Alert" <98farhan94@gmail.com>',
      to: email,
      subject: `${chain} price alert!`,
      text: `${chain} price is now ${price}`,
    });
    console.log(`Email sent to ${email} for ${chain} price alert`);
  }
}
