import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

export default function Module1Home() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Module 1</h1>
      <p>This is Module 1 page.</p>
      <Card className="mt-4">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Welcome to Module 1</h2>
          <p className="mb-4">
            This is a sample card component used in Module 1 Home page.
          </p>
          <Button onClick={() => alert("Button in Module 1 clicked!")}>
            Click Me
          </Button>
        </div>
      </Card>
    </div>
  );
}
