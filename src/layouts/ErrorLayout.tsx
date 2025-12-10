export default function ErrorLayout({ error }: { error: unknown }) {
  return (
    <div className="p-10 text-center bg-red-50 min-h-screen">
      <h1 className="text-3xl font-bold text-red-600">Something went wrong</h1>
      <p className="mt-4 text-gray-700">{String(error)}</p>
    </div>
  );
}
