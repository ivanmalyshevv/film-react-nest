import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FilmsDataProvider } from '../repository/films.repository';

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: FilmsDataProvider;

  const mockFilmsRepository = {
    obtainAllFilms: jest.fn(),
    obtainFilmSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmsDataProvider,
          useValue: mockFilmsRepository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    repository = module.get<FilmsDataProvider>(FilmsDataProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAllFilms', () => {
    it('should return all films from repository', async () => {
      const expectedFilms = {
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

      mockFilmsRepository.obtainAllFilms.mockResolvedValue(expectedFilms);

      const result = await service.fetchAllFilms();

      expect(repository.obtainAllFilms).toHaveBeenCalled();
      expect(result).toEqual(expectedFilms);
    });
  });

  describe('fetchFilmSchedule', () => {
    it('should return film schedule for valid film id', async () => {
      const filmId = 'valid-film-id';
      const expectedSchedule = {
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

      mockFilmsRepository.obtainFilmSchedule.mockResolvedValue(expectedSchedule);

      const result = await service.fetchFilmSchedule(filmId);

      expect(repository.obtainFilmSchedule).toHaveBeenCalledWith(filmId);
      expect(result).toEqual(expectedSchedule);
    });
  });
});