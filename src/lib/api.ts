import { PaginatedResponse, ID } from "../lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.mplats.se/api";

export const auth = {
  login: async (email: string, password: string): Promise<{ token: string; user: any }> => {
    return request("auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ success: boolean; user: any }> => {
    return request("auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
  },
};


// 🌍 Global request handler (central place for ALL token + content-type logic)
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    // REMOVE this unless backend uses cookies
    // credentials: "include",
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`API error: ${res.status} - ${message}`);
  }

  if (res.headers.get("Content-Length") === "0" || res.status === 204) {
    return null as T;
  }

  return res.json();
}



// 🔧 CRUD helpers
export const api = {
  // GET /resource?page=1&limit=10
  getAll: async <T>(
  resource: string,
  params: { page?: number; limit?: number; q?: string; sort?: string } = {}
): Promise<PaginatedResponse<T>> => {
  
  const cleanParams: Record<string, string> = {};

  if (params.page) cleanParams.page = params.page.toString();
  if (params.limit) cleanParams.limit = params.limit.toString();
  if (params.q) cleanParams.q = params.q;
  if (params.sort) cleanParams.sort = params.sort;

  const query = new URLSearchParams(cleanParams).toString();
  const url = `${resource}${query ? `?${query}` : ""}`;

  return request<PaginatedResponse<T>>(url);
},

  // GET /resource/:id
  getOne: async <T>(resource: string, id: ID): Promise<T> =>
    request<T>(`${resource}/${id}`),

  // POST /resource
  create: async <T>(resource: string, data: any): Promise<T> => {
    const isFormData = data instanceof FormData;
    return request<T>(resource, {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  // PUT /resource/:id  (supports JSON + FormData)
  update: async <T>(resource: string, id: ID, data: any): Promise<T> => {
    const isFormData = data instanceof FormData;
    return request<T>(`${resource}/${id}`, {
      method: "PUT",
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  // DELETE /resource/:id
  delete: async (resource: string, id: ID): Promise<{ success: boolean; id: ID }> =>
    request<{ success: boolean; id: ID }>(`${resource}/${id}`, {
      method: "DELETE",
    }),

  // POST custom endpoint (supports JSON + FormData)
  post: async <T>(endpoint: string, body: any, isFormData = false): Promise<T> => {
    return request<T>(endpoint, {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  // PUT custom endpoint (supports JSON + FormData)
  put: async <T>(endpoint: string, body: any): Promise<T> => {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      method: "PUT",
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  // DELETE custom endpoint
  del: async <T>(endpoint: string): Promise<T> =>
    request<T>(endpoint, { method: "DELETE" }),

  // GET custom endpoint
  get: async <T>(endpoint: string): Promise<T> => request<T>(endpoint),
};
