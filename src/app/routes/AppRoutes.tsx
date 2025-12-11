import { lazy } from "react";
import NotFound from "@/shared/error/NotFound";
import { useRoutes } from "react-router-dom";

// Home Landing Page
const Home = lazy(() => import("@/shared/components/Dashboard"));

// Modules
const Maintenance = lazy(() => import("@/modules/maintenance/pages/Maintenance"));

// PWA modules
const Pwa1Home = lazy(() => import("@/modules/pwa-module1/pages/Pwa1Home"));

export default function AppRoutes() {
  return useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/maintenance",
      element: <Maintenance />,
    },
    {
      path: "/pwa-1",
      element: <Pwa1Home />,
    },
    { path: "*", element: <NotFound /> },
  ]);
}
