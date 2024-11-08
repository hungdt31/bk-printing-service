import { PublicLayout } from "@/layout/PublicLayout";
import { AuthLayout } from "@/layout/AuthLayout";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import { paths } from "./utils/path";
import { PrivateLayout } from "@/layout/PrivateLayout";
import { Profile } from "@/pages/Profile";

export const AuthRoutes = {
  layout: AuthLayout,
  routes: [
    {
      path: paths.LoginPage,
      element: LoginPage,
    },
    {
      path: paths.SignupPage,
      element: SignupPage,
    },
  ],
};

export const PublicRoutes = {
  layout: PublicLayout,
  routes: [
    {
      path: paths.Home,
      element: Home,
    },
  ],
};

export const PrivateRoutes = {
  layout: PrivateLayout,
  routes: [
    {
      path: paths.Profile,
      element: Profile,
    },
  ],
};
