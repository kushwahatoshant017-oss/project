jest.mock('@database/redis');
jest.mock('@repositories/weather.repository');
jest.mock('@repositories/forecast.repository');
jest.mock('@utils/logger');

describe('WeatherService', () => {
  let weatherService: any;

  beforeAll(() => {
    jest.isolateModules(() => {
      weatherService = require('@services/weather.service').weatherService;
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentWeather', () => {
    it('should return cached data if available', async () => {
      const redisClient = require('@database/redis').default;
      const cachedData = { temperature: 25, humidity: 60 };
      redisClient.get.mockResolvedValue(cachedData);

      const result = await weatherService.getCurrentWeather(40.7128, -74.006);

      expect(result).toEqual(cachedData);
      expect(redisClient.get).toHaveBeenCalledWith('weather:current:40.7128:-74.006:metric');
    });

    it('should fetch and cache if no cached data', async () => {
      const redisClient = require('@database/redis').default;
      const weatherRepository = require('@repositories/weather.repository').weatherRepository;

      redisClient.get.mockResolvedValue(null);
      redisClient.set.mockResolvedValue(true);
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
      expect(redisClient.set).toHaveBeenCalled();
      expect(weatherRepository.create).toHaveBeenCalled();
    });
  });
});
