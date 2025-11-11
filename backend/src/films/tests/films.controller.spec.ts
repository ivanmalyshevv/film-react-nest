import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from '../films.controller';
import { FilmsService } from '../films.service';
import { GetFilmDto, GetScheduleDto } from '../dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: FilmsService;

  const mockFilmsService = {
    fetchAllFilms: jest.fn(),
    fetchFilmSchedule: jest.fn(),
  };

  const mockFilm: GetFilmDto = {
    id: 'test-id',
    title: 'Test Film',
    description: 'Test Description',
    image: 'test.jpg',
    cover: 'cover.jpg',
    schedule: []
  };

  const mockSchedule: GetScheduleDto[] = [{
    id: 'schedule-id',
    daytime: '2024-01-01T10:00:00Z',
    hall: 1,
    rows: 5,
    seats: 10,
    price: 350,
    taken: []
  }];

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
    filmsService = module.get<FilmsService>(FilmsService);
  });

  describe('obtainFilmsCollection', () => {
    it('should return films collection', async () => {
      mockFilmsService.fetchAllFilms.mockResolvedValue({
        total: 1,
        items: [mockFilm]
      });

      const result = await controller.obtainFilmsCollection();

      expect(result).toEqual({
        total: 1,
        items: [mockFilm]
      });
      expect(filmsService.fetchAllFilms).toHaveBeenCalled();
    });
  });

  describe('obtainFilmScreenings', () => {
    it('should return film schedule', async () => {
      const filmId = 'test-id';
      mockFilmsService.fetchFilmSchedule.mockResolvedValue({
        total: 1,
        items: mockSchedule
      });

      const result = await controller.obtainFilmScreenings(filmId);

      expect(result).toEqual({
        total: 1,
        items: mockSchedule
      });
      expect(filmsService.fetchFilmSchedule).toHaveBeenCalledWith(filmId);
    });
  });
});