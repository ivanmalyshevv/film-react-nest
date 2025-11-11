import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { CreateOrderDto, TicketDto } from '../dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  const mockOrderService = {
    processOrderCreation: jest.fn(),
  };

  const mockTicket: TicketDto = {
    film: 'film-id',
    session: 'session-id',
    daytime: '2024-01-01T10:00:00Z',
    row: 1,
    seat: 1,
    price: 350
  };

  const mockCreateOrderDto: CreateOrderDto = {
    email: 'test@example.com',
    phone: '+79123456789',
    tickets: [mockTicket]
  };

  const mockOrderResult = {
    total: 1,
    items: [mockTicket],
    updatedSessions: []
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
    orderService = module.get<OrderService>(OrderService);
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      mockOrderService.processOrderCreation.mockResolvedValue(mockOrderResult);

      const result = await controller.createOrder(mockCreateOrderDto);

      expect(result).toEqual(mockOrderResult);
      expect(orderService.processOrderCreation).toHaveBeenCalledWith(mockCreateOrderDto);
    });
  });
});