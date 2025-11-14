import { useEffect, useState } from "react";

function App() {
  const [message1, setMessage1] = useState("Loading...");
  const [message2, setMessage2] = useState("Loading...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          // change the URLs to match your API endpoints
          fetch("https://localhost:7209/api/MicroserviceTwo"),
          fetch("https://localhost:7075/api/MicroserviceOne"),
        ]);

        if (!res1.ok) {
          throw new Error(`API 1 failed: ${res1.status} ${res1.statusText}`);
        }
        if (!res2.ok) {
          throw new Error(`API 2 failed: ${res2.status} ${res2.statusText}`);
        }

        const data1 = await res1.text();
        const data2 = await res2.text();

        setMessage1(data1);
        setMessage2(data2);
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(err.message);
        setMessage1("");
        setMessage2("");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h3>API Outputs + Docker Experiment:</h3>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <>
          <p>
            <strong>Output 1:</strong> {message1}
          </p>
          <p>
            <strong>Output 2:</strong> {message2}
          </p>
        </>
      )}
    </div>
  );
}

export default App;
