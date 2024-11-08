export const paths = {
  Home: "/",
  LoginPage: "/sign-in",
  SignupPage: "/sign-up",
  Profile: "/profile",
};

// Default direct for actions
export const DEFAULT_DIRECT_AFTER_LOGIN = paths.Profile;
export const DEFAULT_DIRECT_AFTER_LOGOUT = paths.Home;
export const DEFAULT_DIRECT_AFTER_SIGNUP = paths.Profile;

// Redirects
export const REDIRECT_IF_AUTHENTICATED = paths.Home; // If user is already logged in, redirect to Home
export const REDIRECT_IF_NOT_AUTHENTICATED = paths.LoginPage; // If user is not logged in, redirect to Signin
