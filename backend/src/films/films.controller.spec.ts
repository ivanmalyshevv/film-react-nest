import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilmsService = {
    fetchAllFilms: jest.fn(),
    fetchFilmSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('obtainFilmsCollection', () => {
    it('should return all films', async () => {
      const expectedResult = {
        total: 2,
        items: [
          {
            id: '1',
            title: 'Film 1',
            description: 'Description 1',
            image: 'image1.jpg',
            cover: 'cover1.jpg',
            schedule: [],
          },
        ],
      };

      mockFilmsService.fetchAllFilms.mockResolvedValue(expectedResult);

      const result = await controller.obtainFilmsCollection();

      expect(service.fetchAllFilms).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('obtainFilmScreenings', () => {
    it('should return film schedule for valid film id', async () => {
      const filmId = 'valid-film-id';
      const expectedResult = {
        total: 1,
        items: [
          {
            id: 'schedule-1',
            daytime: '2024-06-28T10:00:53+03:00',
            hall: 1,
            rows: 5,
            seats: 10,
            price: 350,
            taken: [],
          },
        ],
      };

      mockFilmsService.fetchFilmSchedule.mockResolvedValue(expectedResult);

      const result = await controller.obtainFilmScreenings(filmId);

      expect(service.fetchFilmSchedule).toHaveBeenCalledWith(filmId);
      expect(result).toEqual(expectedResult);
    });
  });
});
