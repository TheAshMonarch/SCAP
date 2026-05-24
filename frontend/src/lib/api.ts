// ====================== CONFIG ======================
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000";

// In-memory access token (best practice for security)
let accessToken: string | null = null;

// ====================== TOKEN HELPERS ======================
export const setAccessToken = (token: string) => {
  accessToken = token;
  localStorage.setItem('scap_access_token', token); // backup for page refresh
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem('scap_access_token');
};

// Load token when page refreshes
if (typeof window !== 'undefined') {
  const savedToken = localStorage.getItem('scap_access_token');
  if (savedToken) accessToken = savedToken;
}

// ====================== TYPES ======================
export interface Student {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  department?: string;
  faculty?: string;
  level: number;
  semester: number;
  gpa?: number;
  enrolledCourses?: any[];
}
export interface _Class{
  course: string;
  professor: string,
  schedule: string,
  time: string,
  date: string,
  classDocuments?: string;
  venue: string;
  attendees: string[];
}

// ====================== API CLIENT ======================
export const api = {
  async post<T = any>(endpoint: string, body: any): Promise<T> {
    return request(endpoint, 'POST', body);
  },

  async get<T = any>(endpoint: string): Promise<T> {
    return request(endpoint, 'GET');
  },

  async put<T = any>(endpoint: string, body: any): Promise<T> {
    return request(endpoint, 'PUT', body);
  },

  async patch<T = any>(endpoint: string, body: any): Promise<T> {
    return request(endpoint, 'PATCH', body);
  },

  async delete<T = any>(endpoint: string): Promise<T> {
    return request(endpoint, 'DELETE');
  },
};

// ====================== CORE REQUEST FUNCTION ======================
async function request<T = any>(
  endpoint: string,
  method: string,
  body?: any
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  console.log(`[API] ${method} ${url}`);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add JWT token if available
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',        // Required to send/receive HttpOnly cookies (refreshToken)
  });

  console.log(`[API] Response: ${response.status} ${response.statusText}`);

  // Handle errors
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // Ignore if response is not JSON
    }

    if (response.status === 401) {
      clearAccessToken();
      window.location.href = '/auth';
    }

    throw new Error(errorMessage);
  }

  return response.json();
}