import { useOnlineStatus } from "@/shared/hooks/useOnlineStatus";
import OfflineError from "@/shared/error/OfflineError";
import { Suspense } from "react";

export default function GuardedRoute({
  element,
  isPwa,
}: {
  element: JSX.Element;
  isPwa: boolean;
}) {
  const online = useOnlineStatus();

  if (!online && !isPwa) {
    return <OfflineError />;
  }

  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      {element}
    </Suspense>
  );
}
