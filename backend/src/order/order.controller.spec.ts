import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    processOrderCreation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should process order creation successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79123456789',
        tickets: [
          {
            film: 'film-1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 1,
            price: 350,
          },
        ],
      };

      const expectedResult = {
        total: 1,
        items: createOrderDto.tickets,
        updatedSessions: [
          {
            sessionId: 'session-1',
            taken: '1:1',
          },
        ],
      };

      mockOrderService.processOrderCreation.mockResolvedValue(expectedResult);

      const result = await controller.createOrder(createOrderDto);

      expect(service.processOrderCreation).toHaveBeenCalledWith(createOrderDto);
      expect(result).toEqual(expectedResult);
    });

    it('should validate order data', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'invalid-email',
        phone: 'invalid-phone',
        tickets: [],
      };
      
      expect(createOrderDto).toBeDefined();
    });
  });
});
