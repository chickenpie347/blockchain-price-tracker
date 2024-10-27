import { Test, TestingModule } from '@nestjs/testing';
import { AlertService } from './alert.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Price } from '../price/price.entity';
import { Alert } from './alert.entity';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('AlertService', () => {
  let service: AlertService;
  let alertRepository: Repository<Alert>;
  let priceRepository: Repository<Price>;
  let transporter: any;

  const mockPriceRepository = {
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([{ chain: 'ETH', price: 2000 }]), // Mock return value
    }),
    find: jest.fn(), // Add mock for find
    findOne: jest.fn(), // Add mock for findOne
  };

  const mockAlertRepository = {
    find: jest.fn(), // Mock find method to return alerts
    save: jest.fn(),
  };

  beforeEach(async () => {
    transporter = {
      sendMail: jest.fn().mockResolvedValue(true), // Mock sendMail to resolve successfully
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(transporter); // Mock createTransport to return the mocked transporter

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertService,
        {
          provide: getRepositoryToken(Alert),
          useValue: mockAlertRepository,
        },
        {
          provide: getRepositoryToken(Price),
          useValue: mockPriceRepository,
        },
      ],
    }).compile();

    service = module.get<AlertService>(AlertService);
    alertRepository = module.get<Repository<Alert>>(getRepositoryToken(Alert));
    priceRepository = module.get<Repository<Price>>(getRepositoryToken(Price));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Example test case to check email sending
  it('should send an email if the price increased by more than 3%', async () => {
    const mockPrice = { id:1 ,chain: 'ethereum', price: 1000, createdAt: new Date() }; // Define your mock price here

    // Mock the find and findOne methods
    const currentPrice = { id: 2, timestamp: new Date(), chain: 'ethereum', price: 1040, createdAt: new Date() };
    jest.spyOn(priceRepository, 'find').mockResolvedValue([mockPrice]);
    jest.spyOn(priceRepository, 'findOne').mockResolvedValue(currentPrice);

    // Mock alerts to return an array
    const mockAlerts = [
      {id:1, chain: 'ethereum', dollar: 1000, email: 'mock@gmail.com',createdAt: new Date() }, // Mock an alert
    ];
    jest.spyOn(alertRepository, 'find').mockResolvedValue(mockAlerts); // Ensure find returns an array of alerts

    await service.checkPriceAlerts();

    expect(transporter.sendMail).toHaveBeenCalled(); // Verify sendMail was called
  });
});
