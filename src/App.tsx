import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./app/routes/AppRoutes";
import Header from "./shared/components/Header";
import ErrorBoundary from "./shared/error/ErrorBoundary";
import ErrorLayout from "./layouts/ErrorLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <ErrorBoundary fallback={({ error }) => <ErrorLayout error={error} />}>
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            <AppRoutes />
          </Suspense>
        </ErrorBoundary>
      </main>
    </BrowserRouter>
  );
}
