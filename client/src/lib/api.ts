// API Configuration for connecting to the backend server
// Update this URL when deploying to production

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  // Auth
  adminLogin: `${API_BASE_URL}/api/auth/admin/login`,
  userLogin: `${API_BASE_URL}/api/auth/login`,
  userRegister: `${API_BASE_URL}/api/auth/register`,

  // Users
  users: `${API_BASE_URL}/api/users`,
  user: (id: string) => `${API_BASE_URL}/api/users/${id}`,

  // Tickets
  tickets: `${API_BASE_URL}/api/tickets`,
  ticket: (id: string) => `${API_BASE_URL}/api/tickets/${id}`,

  // Upload
  uploadSingle: `${API_BASE_URL}/api/upload/single`,
  uploadMultiple: `${API_BASE_URL}/api/upload/multiple`,
  file: (filename: string) => `${API_BASE_URL}/uploads/${filename}`,

  // Health
  health: `${API_BASE_URL}/health`,
};

// Helper function to make authenticated requests
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// File upload helper
export async function uploadFiles(files: File[]): Promise<{
  message: string;
  files: Array<{
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    url: string;
  }>;
}> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(API_ENDPOINTS.uploadMultiple, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Upload failed" }));
    throw new Error(error.message);
  }

  return response.json();
}

export default API_ENDPOINTS;
