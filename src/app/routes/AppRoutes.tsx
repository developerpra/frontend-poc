import GuardedRoute from "./GuardedRoute";
import { safeLazy } from "@/shared/utils/safeLazy";
import NotFound from "@/shared/error/NotFound";
import { useRoutes } from "react-router-dom";

// Non-PWA modules
const Module1Home = safeLazy("/src/modules/module1/pages/Module1Home.tsx");

// PWA modules
const Pwa1Home = safeLazy("/src/modules/pwa-module1/pages/Pwa1Home.tsx");

export default function AppRoutes() {
  return useRoutes([
    {
      path: "/module-1",
      element: <GuardedRoute element={<Module1Home />} isPwa={false} />,
    },
    {
      path: "/pwa-1",
      element: <GuardedRoute element={<Pwa1Home />} isPwa={true} />,
    },

    { path: "*", element: <NotFound /> },
  ]);
}
