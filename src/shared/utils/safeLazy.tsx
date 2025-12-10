import { lazy } from "react";
import ModuleError from "../error/ModuleError";
import { pages } from "./moduleLoader";

export function safeLazy(path: string) {
  const loader = pages[path];

  // If file does NOT exist
  if (!loader) {
    return lazy(() =>
      Promise.resolve({
        default: () => (
          <ModuleError
            error={`Module file not found at path: ${path}`}
            path={path}
            onRetry={() => window.location.reload()}
          />
        ),
      })
    );
  }

  // If file exists but fails to load OR runtime error
  return lazy(async () => {
    try {
      return await loader();
    } catch (error) {
      console.error("MODULE LOAD ERROR:", error);

      const errorMessage = error instanceof Error ? error.message : String(error);

      return {
        default: () => (
          <ModuleError
            error={errorMessage}
            path={path}
            onRetry={() => window.location.reload()}
          />
        ),
      };
    }
  });
}
