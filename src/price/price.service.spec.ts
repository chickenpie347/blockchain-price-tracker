import { Test, TestingModule } from '@nestjs/testing';
import { PriceService } from './price.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Price } from './price.entity';

describe('PriceService', () => {
  let service: PriceService;
  let repository: Repository<Price>;

  const mockPrices: Price[] = [
    { id: 1, chain: 'ethereum', price: 2000, createdAt: new Date() },
    { id: 2, chain: 'polygon', price: 2000, createdAt: new Date() },
  ];

  const mockPriceRepository = {
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockPrices),
    }),
    find: jest.fn().mockResolvedValue(mockPrices),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceService,
        {
          provide: getRepositoryToken(Price),
          useValue: mockPriceRepository,
        },
      ],
    }).compile();

    service = module.get<PriceService>(PriceService);
    repository = module.get<Repository<Price>>(getRepositoryToken(Price));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPricesForLast24Hours', () => {
    it('should return prices for the last 24 hours', async () => {
      //const result = [{"ethereum":{ id:1, timestamp: new Date(), chain: 'ethereum', price: 2000, createdAt: new Date() }, "polygon":{ id:1, timestamp: new Date(), chain: 'polygon', price: 2000, createdAt: new Date() } }];

      jest.spyOn(repository, 'find').mockResolvedValue(mockPrices);

      const prices = await service.getPricesForLast24Hours();
      expect(prices).toEqual(mockPrices);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
