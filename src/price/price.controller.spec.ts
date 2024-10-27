import { Test, TestingModule } from '@nestjs/testing';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';
import { Price } from './price.entity';

describe('PriceController', () => {
  let controller: PriceController;
  let service: PriceService;

  const mockPriceService = {
    getPricesForLast24Hours: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceController],
      providers: [
        {
          provide: PriceService,
          useValue: mockPriceService,
        },
      ],
    }).compile();

    controller = module.get<PriceController>(PriceController);
    service = module.get<PriceService>(PriceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPricesForLastDay', () => {
    it('should return prices for the last day', async () => {
      
      //const result = { ethereum:[], polygon: [] };
      const mockPrices: Price[] = [
        { id: 1, chain: 'ethereum', price: 2000, createdAt: new Date() },
        { id: 2, chain: 'polygon', price: 2000, createdAt: new Date() },
    ];
      jest.spyOn(service, 'getPricesForLast24Hours').mockResolvedValue(mockPrices);

      expect(await controller.getHourlyPrices()).toBe(mockPrices);
      expect(service.getPricesForLast24Hours).toHaveBeenCalled();
    });
  });
});
