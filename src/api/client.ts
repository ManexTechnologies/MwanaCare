/**
 * Frontend API client for communicating with Vercel Serverless Functions.
 * Handles JWT token storage in localStorage and attaches auth headers.
 */

const API_BASE = '/api';

// Token management
const TOKEN_KEY = 'mwanacare_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // localStorage not available
  }
}

export function clearStoredToken(): void {
  setStoredToken(null);
}

// Types for API responses
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  babyName?: string;
  dueDate?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export interface ApiGrowthMeasurement {
  id: string;
  date: string;
  weight: number;
  height: number;
  headCircumference?: number;
  notes?: string;
}

export interface ApiVaccineStatus {
  vaccineId: string;
  status: 'done' | 'pending' | 'upcoming';
}

export interface ApiDashboardData {
  currentWeek: number;
  babyWeight: number;
  babyHeight: number;
}

// Generic fetch wrapper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data.error || `Request failed with status ${response.status}`;
    throw new Error(error);
  }

  return data as T;
}

// ===== Auth API =====

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUser(): Promise<{ user: ApiUser }> {
  return apiRequest<{ user: ApiUser }>('/auth/me');
}

// ===== Profile API =====

export async function updateProfile(updates: {
  name?: string;
  baby_name?: string;
  due_date?: string;
}): Promise<{ user: ApiUser }> {
  return apiRequest<{ user: ApiUser }>('/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// ===== Measurements API =====

export async function getMeasurements(): Promise<{
  measurements: ApiGrowthMeasurement[];
}> {
  return apiRequest<{ measurements: ApiGrowthMeasurement[] }>('/measurements');
}

export async function createMeasurement(data: {
  weight: number;
  height: number;
  head_circumference?: number;
}): Promise<{ measurement: ApiGrowthMeasurement }> {
  return apiRequest<{ measurement: ApiGrowthMeasurement }>('/measurements', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ===== Vaccines API =====

export async function getVaccineStatuses(): Promise<{
  statuses: ApiVaccineStatus[];
}> {
  return apiRequest<{ statuses: ApiVaccineStatus[] }>('/vaccines');
}

export async function updateVaccineStatus(
  vaccineId: string,
  status: 'done' | 'pending' | 'upcoming'
): Promise<{ status: ApiVaccineStatus }> {
  return apiRequest<{ status: ApiVaccineStatus }>('/vaccines', {
    method: 'POST',
    body: JSON.stringify({ vaccineId, status }),
  });
}

// ===== Dashboard API =====

export async function getDashboardData(): Promise<{
  dashboard: ApiDashboardData;
}> {
  return apiRequest<{ dashboard: ApiDashboardData }>('/dashboard');
}
