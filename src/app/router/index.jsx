// You can youse lazy load if you want
// But please change the error boundary system
// Because all of the system has their on cycle

import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy } from "react";
import SessionExpiredModal from "../../features/auth/components/SessionExpiredModal.jsx";
import { MainLayout } from "../../shared/components/layouts/MainLayout.jsx";
import PublicRoute from "../../shared/components/guards/PublicRoute.jsx";
import LoginPage from "../../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../../features/auth/pages/RegisterPage.jsx";
import ForgotPasswordPage from "../../features/auth/pages/ForgotPasswordPage.jsx";
import ForbiddenPage from "../../shared/components/pages/ForbiddenPage.jsx";
import ErrorBoundary from "../../shared/components/ui/ErrorBoundary.jsx";
import NotFoundPage from "../../shared/components/pages/NotFoundPage.jsx";
import MainPage from "../../features/landingPage/pages/MainPage.jsx";
import FormProfile from "../../features/Profiling/pages/FormProfile.jsx";
import Questioner from "../../features/Profiling/pages/Questioner.jsx";
import Preference from "../../features/Profiling/pages/Preference.jsx";
import Suggestion from "../../features/Profiling/pages/Suggestion.jsx";
import Dashboard from "../../features/dashboard/pages/Dashboard.jsx";
const DashboardLazy = lazy(() => import("../../features/dashboard/pages/Dashboard.jsx"));

const RootLayout = () => (
  <ErrorBoundary>
    <SessionExpiredModal />
    <Outlet />
  </ErrorBoundary>
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          { path: "/", element: <MainPage /> },
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
          { path: "/profiling/questioner", element: <Questioner /> },
          { path: "/profiling/preference", element: <Preference /> },
          { path: "/profiling/form", element: <FormProfile /> },
          { path: "/profiling/suggestion", element: <Suggestion /> },
          { path: "/dashboard", element: <DashboardLazy /> },
        ],
      },
      {
        path: "/forbidden",
        element: <ForbiddenPage />,
      },
      {
        path: "/home",
        // element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { index: true, element: <Dashboard /> },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
