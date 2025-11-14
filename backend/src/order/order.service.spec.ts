import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { FilmsDataProvider } from '../repository/films.repository';
import { Schedule } from '../films/entities/schedule.entity';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderService', () => {
  let service: OrderService;
  let filmsDataProvider: FilmsDataProvider;
  let scheduleRepository: any;

  const mockFilmsDataProvider = {
    locateFilmById: jest.fn(),
  };

  const mockScheduleRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockFilm = {
    id: 'film-1',
    title: 'Test Film',
    schedules: [],
  };

  const mockSchedule = {
    id: 'session-1',
    daytime: '2024-06-28T10:00:53+03:00',
    hall: 1,
    rows: 5,
    seats: 10,
    price: 350,
    taken: '',
    film: mockFilm,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: FilmsDataProvider,
          useValue: mockFilmsDataProvider,
        },
        {
          provide: getRepositoryToken(Schedule),
          useValue: mockScheduleRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    filmsDataProvider = module.get<FilmsDataProvider>(FilmsDataProvider);
    scheduleRepository = module.get(getRepositoryToken(Schedule));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('processOrderCreation', () => {
    it('should successfully process order with valid tickets', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79123456789',
        tickets: [
          {
            film: 'film-1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 2,
            price: 350,
          },
        ],
      };

      mockFilmsDataProvider.locateFilmById.mockResolvedValue(mockFilm);
      mockScheduleRepository.findOne.mockResolvedValue(mockSchedule);
      mockScheduleRepository.save.mockResolvedValue({
        ...mockSchedule,
        taken: '1:2',
      });

      const result = await service.processOrderCreation(createOrderDto);

      expect(filmsDataProvider.locateFilmById).toHaveBeenCalledWith('film-1');
      expect(scheduleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'session-1' },
      });
      expect(scheduleRepository.save).toHaveBeenCalled();
      expect(result.total).toBe(1);
      expect(result.items).toEqual(createOrderDto.tickets);
    });

    it('should throw ConflictException when film does not exist', async () => {
      const createOrderDto: CreateOrderDto = {
        tickets: [
          {
            film: 'non-existent-film',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 2,
            price: 350,
          },
        ],
      };

      mockFilmsDataProvider.locateFilmById.mockResolvedValue(null);

      await expect(service.processOrderCreation(createOrderDto))
        .rejects
        .toThrow(ConflictException);
    });

    it('should throw ConflictException when schedule does not exist', async () => {
      const createOrderDto: CreateOrderDto = {
        tickets: [
          {
            film: 'film-1',
            session: 'non-existent-session',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 2,
            price: 350,
          },
        ],
      };

      mockFilmsDataProvider.locateFilmById.mockResolvedValue(mockFilm);
      mockScheduleRepository.findOne.mockResolvedValue(null);

      await expect(service.processOrderCreation(createOrderDto))
        .rejects
        .toThrow(ConflictException);
    });

    it('should throw ConflictException when seat is already taken', async () => {
      const createOrderDto: CreateOrderDto = {
        tickets: [
          {
            film: 'film-1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 2,
            price: 350,
          },
        ],
      };

      const takenSchedule = {
        ...mockSchedule,
        taken: '1:2,2:3',
      };

      mockFilmsDataProvider.locateFilmById.mockResolvedValue(mockFilm);
      mockScheduleRepository.findOne.mockResolvedValue(takenSchedule);

      await expect(service.processOrderCreation(createOrderDto))
        .rejects
        .toThrow(ConflictException);
    });

    it('should throw ConflictException when no tickets provided', async () => {
      const createOrderDto: CreateOrderDto = {
        tickets: [],
      };

      await expect(service.processOrderCreation(createOrderDto))
        .rejects
        .toThrow(ConflictException);
    });
  });
});