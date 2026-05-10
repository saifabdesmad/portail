export const API_BASE = 'http://localhost:3000/api';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }
  return res.json();
}

// ── Products ──────────────────────────────────────────────────────────────────

export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category_slug: string;
  category_name: string;
  stock: number;
  rating: number;
  review_count: number;
  images: string[];
  tags: string[];
  material: string;
  colors: string[];
  is_new: boolean;
  is_bestseller: boolean;
  inStock: boolean;
}

export const productsApi = {
  list: (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.search)   q.set('search',   params.search);
    if (params?.page)     q.set('page',     String(params.page));
    if (params?.limit)    q.set('limit',    String(params.limit));
    return apiFetch<{ data: ApiProduct[]; pagination: { total: number; page: number; pages: number } }>(
      `/products?${q}`
    );
  },
  get:    (id: number)                  => apiFetch<ApiProduct>(`/products/${id}`),
  create: (body: Partial<ApiProduct>)   => apiFetch<{ id: number }>('/products', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: number, body: Partial<ApiProduct>) => apiFetch<{ message: string }>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: number)                  => apiFetch<{ message: string }>(`/products/${id}`, { method: 'DELETE' }),
};

// ── Orders ────────────────────────────────────────────────────────────────────

export interface ApiOrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  color?: string;
}

export interface ApiOrder {
  id: number;
  client_id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  status: string;
  total_amount: number;
  shipping_amount: number;
  discount_amount: number;
  promo_code?: string;
  notes?: string;
  created_at: string;
  items: ApiOrderItem[];
}

export const ordersApi = {
  list:         (params?: { status?: string }) => {
    const q = params?.status && params.status !== 'all' ? `?status=${params.status}` : '';
    return apiFetch<{ data: ApiOrder[] }>(`/orders${q}`);
  },
  get:          (id: number)                   => apiFetch<ApiOrder>(`/orders/${id}`),
  create:       (body: {
    client_id: number;
    items: { product_id: number; quantity: number; unit_price: number; color?: string }[];
    notes?: string;
    shipping_amount?: number;
  }) => apiFetch<{ id: number }>('/orders', { method: 'POST', body: JSON.stringify(body) }),
  updateStatus: (id: number, status: string)   =>
    apiFetch<{ message: string }>(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// ── Clients ───────────────────────────────────────────────────────────────────

export interface ApiClient {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  order_count: number;
  total_spent: number;
  created_at: string;
}

export const clientsApi = {
  list:   ()                                                   => apiFetch<ApiClient[]>('/clients'),
  get:    (id: number)                                         => apiFetch<ApiClient & { orders: ApiOrder[] }>(`/clients/${id}`),
  create: (body: { name: string; email: string; phone?: string; address?: string }) =>
    apiFetch<{ id: number }>('/clients', { method: 'POST', body: JSON.stringify(body) }),
};

// ── Stats ─────────────────────────────────────────────────────────────────────

export interface ApiStats {
  products:      number;
  inStock:       number;
  orders:        number;
  pendingOrders: number;
  clients:       number;
  revenue:       number;
  byStatus:      { status: string; cnt: number }[];
  recentOrders:  { id: number; status: string; total_amount: number; created_at: string; client_name: string }[];
}

export const statsApi = {
  get: () => apiFetch<ApiStats>('/stats'),
};
