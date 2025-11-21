import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./app/routes/AppRoutes";
import Header from "./shared/components/Header";
import ErrorBoundary from "./shared/error/ErrorBoundary";
import ErrorLayout from "./layouts/ErrorLayout";
import Sidebar from "./shared/components/Sidebar";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 bg-gray-50">
          <ErrorBoundary
            fallback={({ error }) => <ErrorLayout error={error} />}
          >
            <Suspense fallback={<div className="p-4">Loading...</div>}>
              <AppRoutes />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </BrowserRouter>
  );
}
