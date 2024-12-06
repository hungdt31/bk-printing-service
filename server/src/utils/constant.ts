type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'ALL';

interface ProtectedRoute {
  path: string;
  method: HttpMethod;
}

export const colorText = "\x1b[36m%s\x1b[0m";

export const protectedRoutes: ProtectedRoute[] = [
  { path: "/users/profile", method: 'GET' },
  { path: "/users", method: 'PATCH' },
  { path: "/documents/upload", method: 'POST' },
  { path: "/documents/:id", method: 'ALL' },
  { path: "/documents/list", method: 'GET' },
  { path: "/documents", method: 'DELETE' },
  { path: "/purchase-orders", method: 'ALL' },
  { path: "/purchase-orders/:id", method: 'PATCH' },
  { path: "/print-orders", method: 'ALL' },
  { path: "/print-orders/payment/:id", method: 'PUT' },
  { path: "/print-orders/history", method: 'GET' },
  { path: "/printers", method: 'ALL' },
  { path: "/print-orders/bulk-payment", method: 'PUT'},
  { path: "/print-orders/:id", method: 'PATCH'},
  { path: "/config", method: 'GET'},
  { path: "/statistic/me", method: 'GET'},
];

export const spsoRoutes: ProtectedRoute[] = [
  { path: "/printers/:id", method: 'GET' },
  { path: "/users/update-settings", method: 'PATCH' },
  { path: "/purchase-orders/:id", method: 'GET' },
  { path: "/print-orders/:id", method: 'GET' },
  { path: "/users", method: 'GET' },
  { path: "/documents/:id", method: 'GET' },
  { path: "/config", method: 'PUT'},
  { path: "/statistic", method: 'ALL'},
  { path: "/print-orders/history", method: 'POST'},
];

export const tokenLife = {
  accessToken: "1h",
  refreshToken: "7d",
};

export const ROLE = {
  spso: "SPSO",
  student: "STUDENT",
  lecturer: "LECTURER",
};
