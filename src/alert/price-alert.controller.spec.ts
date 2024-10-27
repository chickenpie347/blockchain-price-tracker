import { Test, TestingModule } from '@nestjs/testing';
import { PriceAlertController } from './price-alert.controller';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './create-alert.dto';

describe('PriceAlertController', () => {
  let controller: PriceAlertController;
  let service: AlertService;

  const mockAlertService = {
    setAlert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceAlertController],
      providers: [
        {
          provide: AlertService,
          useValue: mockAlertService,
        },
      ],
    }).compile();

    controller = module.get<PriceAlertController>(PriceAlertController);
    service = module.get<AlertService>(AlertService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('setPriceAlert', () => {
    it('should call setAlert from AlertService', async () => {
      const alertDto: CreateAlertDto = {
        chain: 'ethereum',
        dollar: 1500,
        email: 'test@example.com',
      };

      await controller.setPriceAlert(alertDto);
      expect(service.setAlert).toHaveBeenCalledWith(alertDto);
    });
  });
});
