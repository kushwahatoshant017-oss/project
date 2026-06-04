import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WeatherSphere API',
      version: '1.0.0',
      description: 'Production-ready Weather Forecasting Backend API',
      contact: {
        name: 'WeatherSphere Team',
        email: 'support@weathersphere.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            error: { type: 'string' },
            errors: { type: 'object', additionalProperties: { type: 'array', items: { type: 'string' } } },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
            isEmailVerified: { type: 'boolean' },
            isActive: { type: 'boolean' },
            unitSystem: { type: 'string', enum: ['METRIC', 'IMPERIAL'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        WeatherData: {
          type: 'object',
          properties: {
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            temperature: { type: 'number' },
            feelsLike: { type: 'number' },
            humidity: { type: 'number' },
            windSpeed: { type: 'number' },
            weatherMain: { type: 'string' },
            weatherDesc: { type: 'string' },
            weatherIcon: { type: 'string' },
          },
        },
        Forecast: {
          type: 'object',
          properties: {
            date: { type: 'string' },
            tempMax: { type: 'number' },
            tempMin: { type: 'number' },
            precipitationProb: { type: 'number' },
            weatherCode: { type: 'number' },
          },
        },
        AQIData: {
          type: 'object',
          properties: {
            aqi: { type: 'integer', description: '1-5 scale' },
            pm25: { type: 'number' },
            pm10: { type: 'number' },
            description: { type: 'string' },
            color: { type: 'string' },
          },
        },
        FavoriteLocation: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            locationName: { type: 'string' },
            label: { type: 'string' },
          },
        },
        Alert: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            locationLat: { type: 'number' },
            locationLon: { type: 'number' },
            alertType: { type: 'string', enum: ['TEMPERATURE', 'PRECIPITATION', 'WIND', 'UV_INDEX', 'AIR_QUALITY', 'STORM', 'CUSTOM'] },
            condition: { type: 'string', enum: ['ABOVE', 'BELOW', 'EQUAL', 'CHANGES_BY'] },
            thresholdValue: { type: 'number' },
            isActive: { type: 'boolean' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        CreateFavoriteInput: {
          type: 'object',
          required: ['latitude', 'longitude'],
          properties: {
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            locationName: { type: 'string' },
            label: { type: 'string' },
          },
        },
        CreateAlertInput: {
          type: 'object',
          required: ['locationLat', 'locationLon', 'alertType', 'condition', 'thresholdValue'],
          properties: {
            locationLat: { type: 'number' },
            locationLon: { type: 'number' },
            locationName: { type: 'string' },
            alertType: { type: 'string', enum: ['TEMPERATURE', 'PRECIPITATION', 'WIND', 'UV_INDEX', 'AIR_QUALITY', 'STORM', 'CUSTOM'] },
            condition: { type: 'string', enum: ['ABOVE', 'BELOW', 'EQUAL', 'CHANGES_BY'] },
            thresholdValue: { type: 'number' },
            unitSystem: { type: 'string', enum: ['METRIC', 'IMPERIAL'] },
            cooldownMinutes: { type: 'integer' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'array', items: { type: 'object' } },
            meta: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
                hasNext: { type: 'boolean' },
                hasPrev: { type: 'boolean' },
              },
            },
            timestamp: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Authentication', description: 'Authentication endpoints' },
      { name: 'User', description: 'User profile endpoints' },
      { name: 'Weather', description: 'Weather data endpoints' },
      { name: 'AQI', description: 'Air Quality Index endpoints' },
      { name: 'Favorites', description: 'Favorite locations endpoints' },
      { name: 'Alerts', description: 'Weather alerts endpoints' },
      { name: 'Admin', description: 'Admin endpoints' },
    ],
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } } },
          responses: { 201: { description: 'Registration successful' }, 409: { description: 'Email already registered' } },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login user',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } } },
          responses: { 200: { description: 'Login successful' }, 401: { description: 'Invalid credentials' } },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Authentication'],
          summary: 'Logout user',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Logged out successfully' } },
        },
      },
      '/api/auth/refresh': {
        post: {
          tags: ['Authentication'],
          summary: 'Refresh access token',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { refreshToken: { type: 'string' } } } } } },
          responses: { 200: { description: 'Token refreshed' } },
        },
      },
      '/api/auth/verify-email': {
        post: {
          tags: ['Authentication'],
          summary: 'Verify email address',
          responses: { 200: { description: 'Email verified' } },
        },
      },
      '/api/auth/forgot-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Request password reset',
          responses: { 200: { description: 'Reset email sent if account exists' } },
        },
      },
      '/api/auth/reset-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Reset password with token',
          responses: { 200: { description: 'Password reset successful' } },
        },
      },
      '/api/users/profile': {
        get: {
          tags: ['User'],
          summary: 'Get user profile',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Profile retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } } },
        },
        put: {
          tags: ['User'],
          summary: 'Update user profile',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Profile updated' } },
        },
      },
      '/api/weather/current': {
        get: {
          tags: ['Weather'],
          summary: 'Get current weather',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'lat', required: true, schema: { type: 'number' } },
            { in: 'query', name: 'lon', required: true, schema: { type: 'number' } },
            { in: 'query', name: 'units', schema: { type: 'string', enum: ['metric', 'imperial'] } },
          ],
          responses: { 200: { description: 'Current weather data', content: { 'application/json': { schema: { $ref: '#/components/schemas/WeatherData' } } } } },
        },
      },
      '/api/weather/hourly': {
        get: {
          tags: ['Weather'],
          summary: 'Get hourly forecast',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'lat', required: true, schema: { type: 'number' } },
            { in: 'query', name: 'lon', required: true, schema: { type: 'number' } },
            { in: 'query', name: 'hours', schema: { type: 'integer', default: 48 } },
            { in: 'query', name: 'units', schema: { type: 'string', enum: ['metric', 'imperial'] } },
          ],
          responses: { 200: { description: 'Hourly forecast data' } },
        },
      },
      '/api/weather/daily': {
        get: {
          tags: ['Weather'],
          summary: 'Get daily forecast',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'lat', required: true, schema: { type: 'number' } },
            { in: 'query', name: 'lon', required: true, schema: { type: 'number' } },
            { in: 'query', name: 'days', schema: { type: 'integer', default: 7 } },
            { in: 'query', name: 'units', schema: { type: 'string', enum: ['metric', 'imperial'] } },
          ],
          responses: { 200: { description: 'Daily forecast data' } },
        },
      },
      '/api/weather/history': {
        get: {
          tags: ['Weather'],
          summary: 'Get historical weather data',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'lat', required: true, schema: { type: 'number' } },
            { in: 'query', name: 'lon', required: true, schema: { type: 'number' } },
            { in: 'query', name: 'startDate', required: true, schema: { type: 'string', format: 'date' } },
            { in: 'query', name: 'endDate', required: true, schema: { type: 'string', format: 'date' } },
          ],
          responses: { 200: { description: 'Historical weather data' } },
        },
      },
      '/api/aqi/current': {
        get: {
          tags: ['AQI'],
          summary: 'Get current AQI',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'lat', required: true, schema: { type: 'number' } },
            { in: 'query', name: 'lon', required: true, schema: { type: 'number' } },
          ],
          responses: { 200: { description: 'AQI data', content: { 'application/json': { schema: { $ref: '#/components/schemas/AQIData' } } } } },
        },
      },
      '/api/favorites': {
        post: {
          tags: ['Favorites'],
          summary: 'Add location to favorites',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateFavoriteInput' } } } },
          responses: { 201: { description: 'Location added' } },
        },
        get: {
          tags: ['Favorites'],
          summary: 'Get all favorites',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Favorites list', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/FavoriteLocation' } } } } } },
        },
      },
      '/api/favorites/{id}': {
        delete: {
          tags: ['Favorites'],
          summary: 'Remove location from favorites',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { 200: { description: 'Location removed' } },
        },
      },
      '/api/alerts': {
        get: {
          tags: ['Alerts'],
          summary: 'Get all alerts',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Alerts list', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Alert' } } } } } },
        },
        post: {
          tags: ['Alerts'],
          summary: 'Create a new alert',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateAlertInput' } } } },
          responses: { 201: { description: 'Alert created' } },
        },
      },
      '/api/alerts/{id}': {
        delete: {
          tags: ['Alerts'],
          summary: 'Delete an alert',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { 200: { description: 'Alert deleted' } },
        },
      },
      '/api/admin/users': {
        get: {
          tags: ['Admin'],
          summary: 'Get all users (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
            { in: 'query', name: 'search', schema: { type: 'string' } },
            { in: 'query', name: 'role', schema: { type: 'string', enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] } },
          ],
          responses: { 200: { description: 'Users list', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedResponse' } } } } },
        },
      },
      '/api/admin/stats': {
        get: {
          tags: ['Admin'],
          summary: 'Get system stats (Admin)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'System statistics' } },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
