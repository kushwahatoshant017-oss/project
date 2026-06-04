const mockGet = jest.fn();
const mockSet = jest.fn();

jest.mock('@database/redis', () => ({
  __esModule: true,
  default: {
    get: mockGet,
    set: mockSet,
    del: jest.fn(),
    delPattern: jest.fn(),
    exists: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn(),
    disconnect: jest.fn(),
  },
  redisClient: {
    get: mockGet,
    set: mockSet,
    del: jest.fn(),
    delPattern: jest.fn(),
    exists: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn(),
    disconnect: jest.fn(),
  },
}));

jest.mock('@repositories/weather.repository');
jest.mock('@utils/logger');

describe('WeatherService', () => {
  let weatherService: any;

  beforeAll(() => {
    const mod = require('@services/weather.service');
    weatherService = mod.weatherService;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentWeather', () => {
    it('should return cached data if available', async () => {
      const cachedData = { temperature: 25, humidity: 60 };
      mockGet.mockResolvedValue(cachedData);

      const result = await weatherService.getCurrentWeather(40.7128, -74.006);

      expect(result).toEqual(cachedData);
      expect(mockGet).toHaveBeenCalledWith('weather:current:40.7128:-74.006:metric');
    });

    it('should fetch and cache if no cached data', async () => {
      const weatherRepository = require('@repositories/weather.repository').weatherRepository;

      mockGet.mockResolvedValue(null);
      mockSet.mockResolvedValue(true);
      weatherRepository.create.mockResolvedValue({});

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          current: {
            temperature_2m: 22,
            relative_humidity_2m: 55,
            apparent_temperature: 21,
            precipitation: 0,
            weather_code: 0,
            wind_speed_10m: 10,
            wind_direction_10m: 180,
            wind_gusts_10m: 15,
            uv_index: 5,
          },
          timezone: 'America/New_York',
        }),
      });

      const result = await weatherService.getCurrentWeather(40.7128, -74.006);

      expect(result).toHaveProperty('temperature');
      expect(result).toHaveProperty('humidity');
      expect(mockSet).toHaveBeenCalled();
      expect(weatherRepository.create).toHaveBeenCalled();
    });
  });
});
