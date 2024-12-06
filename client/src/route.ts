import { PublicLayout } from "@/layout/PublicLayout";
import { AuthLayout } from "@/layout/AuthLayout";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import { paths } from "./utils/path";
import { PrivateLayout } from "@/layout/PrivateLayout";
import { Profile } from "@/pages/Dashboard/Profile";
import { OrderPage } from "@/pages/Dashboard/Order";
import { HistoryLog } from "@/pages/Dashboard/History";
import { PurchasePage } from "@/pages/Dashboard/Purchase";
import { DocumentPage } from "@/pages/Dashboard/Document";
import { OrderSettings } from "@/pages/Dashboard/Order/Settings";
import { AdminLayout } from "@/layout/AdminLayout";
import AdminPage from "./pages/Admin";
import PrinterPage from "./pages/Admin/Printer";
import SettingsPage from "./pages/Admin/Settings";
import ReportPage from "./pages/Admin/Report";
import HistoryPage from "./pages/Admin/History";

export const AuthRoutes = {
  layout: AuthLayout,
  routes: [
    {
      path: paths.Login,
      element: LoginPage,
    },
    {
      path: paths.Signup,
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
    {
      path: paths.Order,
      element: OrderPage
    },
    {
      path: paths.History,
      element: HistoryLog
    },
    {
      path: paths.Purchase,
      element: PurchasePage
    },
    {
      path: paths.Document,
      element: DocumentPage
    },
    {
      path: paths.OrderSettings,
      element: OrderSettings
    }
  ],
};

export const AdminRoutes = {
  layout: AdminLayout,
  routes: [
    {
      path: paths.Admin,
      element: AdminPage,
    },
    {
      path: paths.Printer,
      element: PrinterPage,
    },
    {
      path: paths.Settings,
      element: SettingsPage,
    },
    {
      path: paths.Report,
      element: ReportPage,
    },
    {
      path: paths.AdminHistory,
      element: HistoryPage,
    }
  ],
};
