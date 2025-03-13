
import { getAuthState } from "./auth";

const API_URL = "https://api.example.com/v1"; // Mock API URL

// Generic fetch function with auth token
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { token } = getAuthState();
  
  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  headers.set("Content-Type", "application/json");
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  // For demo purposes, we'll simulate API responses
  // In a real app, you would handle the response from the server
  if (endpoint.includes("/users")) {
    return mockUsers as unknown as T;
  } else if (endpoint.includes("/workflows")) {
    return mockWorkflows as unknown as T;
  } else if (endpoint.includes("/data")) {
    return mockTableData as unknown as T;
  }
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Interface for paginated API responses
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// Mock data for demonstration
export const mockUsers = {
  data: Array.from({ length: 20 }).map((_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 5 === 0 ? "admin" : "user",
    status: i % 3 === 0 ? "active" : i % 3 === 1 ? "inactive" : "pending",
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  })),
  meta: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 20,
    totalPages: 2,
  },
};

export const mockWorkflows = {
  data: Array.from({ length: 12 }).map((_, i) => ({
    id: `workflow-${i + 1}`,
    title: `Business Process ${i + 1}`,
    description: `This is a description for business process ${i + 1}. It involves multiple steps and approvals.`,
    status: i % 4 === 0 ? "approved" : i % 4 === 1 ? "rejected" : i % 4 === 2 ? "pending" : "review",
    assignee: {
      id: `user-${(i % 5) + 1}`,
      name: `User ${(i % 5) + 1}`,
      avatarUrl: i % 2 === 0 ? undefined : `/placeholder.svg`,
    },
    progress: Math.min(100, Math.floor(i * 8.33)),
    steps: 5,
    currentStep: Math.min(5, Math.floor(i * 0.4) + 1),
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
  })),
  meta: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 12,
    totalPages: 2,
  },
};

export const mockTableData = {
  data: Array.from({ length: 50 }).map((_, i) => ({
    id: `data-${i + 1}`,
    name: `Item ${i + 1}`,
    category: ['Electronics', 'Furniture', 'Clothing', 'Books', 'Tools'][i % 5],
    status: ['active', 'pending', 'inactive', 'review', 'approved'][i % 5],
    amount: Math.floor(Math.random() * 1000) + 1,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    assignee: `User ${(i % 5) + 1}`,
  })),
  meta: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 50,
    totalPages: 5,
  },
};

// API functions for different entities
export const fetchUsers = async (
  page = 1,
  pageSize = 10,
  search = "",
  sortBy = "name",
  sortDirection = "asc"
): Promise<PaginatedResponse<any>> => {
  const endpoint = `/users?page=${page}&pageSize=${pageSize}&search=${search}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
  return fetchApi<PaginatedResponse<any>>(endpoint);
};

export const fetchWorkflows = async (
  page = 1,
  pageSize = 10,
  status = "",
  search = ""
): Promise<PaginatedResponse<any>> => {
  const endpoint = `/workflows?page=${page}&pageSize=${pageSize}&status=${status}&search=${search}`;
  return fetchApi<PaginatedResponse<any>>(endpoint);
};

export const fetchGridData = async (
  page = 1,
  pageSize = 10,
  search = "",
  sortBy = "name",
  sortDirection = "asc"
): Promise<PaginatedResponse<any>> => {
  const endpoint = `/data?page=${page}&pageSize=${pageSize}&search=${search}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
  return fetchApi<PaginatedResponse<any>>(endpoint);
};
