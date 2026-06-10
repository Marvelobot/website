const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:5000";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  token: string;
  username: string;
}

export interface TableInfo {
  name: string;
  count: number;
}

export interface TableDataResponse {
  rows: Record<string, unknown>[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TableSchema {
  tableName: string;
  primaryKey: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({ success: false, error: res.statusText }));

  if (!res.ok) {
    throw new Error(body.error || body.message || `Request failed (${res.status})`);
  }

  // Backend wraps all responses in { success, data, meta? }
  // Return the `data` field if present, otherwise the whole body
  if (body.success && "data" in body) {
    return body.data as T;
  }

  return body as T;
}

// ── Auth ───────────────────────────────────────────────────────────────────────

export async function adminLogin(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse<LoginResponse>(res);
}

export async function fetchTables(): Promise<TableInfo[]> {
  const res = await fetch(`${API_BASE}/api/tables`, {
    headers: authHeaders(),
  });
  return handleResponse<TableInfo[]>(res);
}

export async function fetchTableSchema(tableName: string): Promise<TableSchema> {
  const res = await fetch(`${API_BASE}/api/tables/${tableName}/schema`, {
    headers: authHeaders(),
  });
  return handleResponse<TableSchema>(res);
}

// ── Table Data ─────────────────────────────────────────────────────────────────

export async function fetchTableData(
  tableName: string,
  page = 1,
  limit = 50,
  search = "",
  sortField = "",
  sortDirection: "asc" | "desc" = "asc",
): Promise<TableDataResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) params.set("search", search);
  if (sortField) {
    params.set("sortField", sortField);
    params.set("sortDirection", sortDirection);
  }

  const res = await fetch(
    `${API_BASE}/api/tables/${tableName}?${params}`,
    { headers: authHeaders() },
  );

  // This endpoint returns { success, data: [...rows], meta: { total, page, limit, totalPages } }
  const body = await res.json().catch(() => ({ success: false, error: res.statusText }));

  if (!res.ok) {
    throw new Error(body.error || body.message || `Request failed (${res.status})`);
  }

  return {
    rows: body.data || [],
    total: body.meta?.total || 0,
    page: body.meta?.page || page,
    limit: body.meta?.limit || limit,
    totalPages: body.meta?.totalPages || 1,
  };
}

// ── Row Mutations ──────────────────────────────────────────────────────────────

export async function updateRow(
  tableName: string,
  id: string | number,
  data: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE}/api/tables/${tableName}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Record<string, unknown>>(res);
}

export async function deleteRow(
  tableName: string,
  id: string | number,
): Promise<{ deleted: string }> {
  const res = await fetch(`${API_BASE}/api/tables/${tableName}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse<{ deleted: string }>(res);
}
