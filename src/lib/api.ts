/**
 * Showcaster API client.
 * All requests go through this module so the base URL and auth header
 * are applied in one place.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

// ── Token helpers (localStorage) ─────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sc_token');
}

export function setToken(token: string): void {
  localStorage.setItem('sc_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('sc_token');
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────

interface ApiOptions extends RequestInit {
  auth?: boolean; // attach Bearer token (default true for non-auth routes)
}

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { auth = true, ...init } = options;

  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };

  if (!(init.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  const json = await res.json();

  if (!res.ok || json.success === false) {
    const message = json.error ?? `HTTP ${res.status}`;
    throw new ApiError(message, res.status, json.field);
  }

  return json.data as T;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public field?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface TokenData {
  token: string;
}

export async function apiRegister(payload: {
  email: string;
  fullName: string;
  password: string;
}): Promise<{ message: string }> {
  return request('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  });
}

export async function apiLogin(payload: {
  email: string;
  password: string;
}): Promise<TokenData> {
  return request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  });
}

export async function apiVerifyOTP(payload: {
  email: string;
  otp: string;
}): Promise<TokenData> {
  return request('/api/v1/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  });
}

export async function apiResendOTP(email: string): Promise<{ message: string }> {
  return request('/api/v1/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
    auth: false,
  });
}

// ── Upload ────────────────────────────────────────────────────────────────────

export async function apiUploadImage(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('file', file);
  return request('/api/v1/upload/image', { method: 'POST', body: form });
}

// ── Jobs ──────────────────────────────────────────────────────────────────────

export interface StepResponse {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl: string | null;
}

export interface JobResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  steps: StepResponse[];
  createdAt: string;
}

export interface JobSummary {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  thumbnailUrl: string | null;
}

export interface JobListResponse {
  jobs: JobSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateJobPayload {
  modelImageUrl: string;
  productImageUrl: string;
  productName: string;
  productCategory: 'beauty' | 'fashion' | 'electronics' | 'health';
  targetAudience: 'man' | 'woman' | 'children' | 'unisex';
  orientation: 'portrait' | 'landscape' | 'square';
  resolution: '720p' | '1080p' | '4k';
}

export async function apiCreateJob(payload: CreateJobPayload): Promise<{ jobId: string }> {
  return request('/api/v1/jobs/generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function apiGetJob(jobId: string): Promise<JobResponse> {
  return request(`/api/v1/jobs/${jobId}`);
}

export async function apiListJobs(page = 1, limit = 20): Promise<JobListResponse> {
  return request(`/api/v1/jobs?page=${page}&limit=${limit}`);
}

export async function apiDeleteJob(jobId: string): Promise<{ message: string }> {
  return request(`/api/v1/jobs/${jobId}`, { method: 'DELETE' });
}

export async function apiCancelJob(jobId: string): Promise<{ message: string }> {
  return request(`/api/v1/jobs/${jobId}/cancel`, { method: 'POST' });
}

// ── Debug ─────────────────────────────────────────────────────────────────────

export interface ScenePromptResponse {
  scene_id: string;
  title: string;
  duration: number;
  visual_prompt: string;
  voice_over: string;
  voice_quality: string;
  motion_profile: {
    camera_angle: string;
    intensity: number;
    micro_movements: string[];
  };
  is_generating_video: boolean;
}

export async function apiGenerateDebugPrompt(payload: {
  stepName: 'Hook' | 'Problem' | 'Solution' | 'Closure';
  productName: string;
  productCategory: string;
  targetAudience: string;
  orientation: string;
  resolution: string;
  modelImageUrl?: string;
}): Promise<ScenePromptResponse> {
  return request('/api/v1/debug/prompt', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
