import { useState } from "react";

export default function ModuleError({
  error,
  path,
  onRetry,
}: {
  error: unknown;
  path: string;
  onRetry: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(error));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Detect if reload SHOULD be shown
  const errorText = String(error || "").toLowerCase();
  const canRetry =
    errorText.includes("network") ||
    errorText.includes("fetch") ||
    errorText.includes("timeout") ||
    errorText.includes("failed to load") ||
    errorText.includes("503") || // server unavailable
    errorText.includes("500") ||
    errorText.includes("connection") ||
    errorText.includes("offline");

  return (
    <div className="p-10 text-center text-gray-800">
      <h1 className="text-2xl font-bold text-red-600">Module Failed to Load</h1>

      <p className="mt-4 text-gray-700">
        Issue with module:{" "}
        <span className="font-mono bg-gray-100 px-2 py-1 rounded">{path}</span>
      </p>

      {error && (
        <pre className="mt-4 p-4 bg-gray-100 border rounded text-left text-sm whitespace-pre-wrap">
          {String(error)}
        </pre>
      )}

      <div className="mt-6 flex justify-center gap-4">
        {/* Show Retry ONLY if the error type supports retry */}
        {canRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Module
          </button>
        )}

        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 min-w-[110px]"
        >
          {copied ? "Copied!" : "Copy Error"}
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        If the issue continues, please raise a support ticket with this error.
      </p>
    </div>
  );
}
