export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  unitSystem?: 'METRIC' | 'IMPERIAL';
}

export interface CreateFavoriteDto {
  latitude: number;
  longitude: number;
  locationName?: string;
  label?: string;
}

export interface CreateAlertDto {
  locationLat: number;
  locationLon: number;
  locationName?: string;
  alertType: 'TEMPERATURE' | 'PRECIPITATION' | 'WIND' | 'UV_INDEX' | 'AIR_QUALITY' | 'STORM' | 'CUSTOM';
  condition: 'ABOVE' | 'BELOW' | 'EQUAL' | 'CHANGES_BY';
  thresholdValue: number;
  unitSystem?: 'METRIC' | 'IMPERIAL';
  cooldownMinutes?: number;
}

export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface DateRangeDto {
  startDate: string;
  endDate: string;
}
