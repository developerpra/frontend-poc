export default function OfflineError() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold text-red-600">
        No Internet Connection
      </h1>
      <p className="mt-2 text-gray-600">
        This module is not available offline. Please reconnect and try again.
      </p>
    </div>
  );
}
