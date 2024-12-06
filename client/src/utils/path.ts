export const paths = {
  Home: "/",
  Login: "/sign-in",
  Signup: "/sign-up",
  Profile: "/dashboard/profile",
  Document: "/dashboard/documents",
  History: "/dashboard/history",
  Purchase: "/dashboard/purchase",
  Order: "/dashboard/orders",
  OrderSettings: "/dashboard/orders/settings",
  Admin: "/admin",
  Printer: "/admin/printers",
  Settings: "/admin/settings",
  Report: "/admin/report",
  Feedback: "/admin/feedback",
  AdminHistory: "/admin/history",
};

// Default direct for actions
export const DEFAULT_DIRECT_AFTER_LOGIN = paths.Home;
export const DEFAULT_DIRECT_AFTER_LOGOUT = paths.Home;
export const DEFAULT_DIRECT_AFTER_SIGNUP = paths.Profile;

// Redirects
export const REDIRECT_IF_AUTHENTICATED = paths.Home; // If user is already logged in, redirect to Home
export const REDIRECT_IF_NOT_AUTHENTICATED = paths.Login; // If user is not logged in, redirect to Signin
