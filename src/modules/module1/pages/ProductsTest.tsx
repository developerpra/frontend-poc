import { useEffect, useState } from "react";
import { api } from "../../../services/api/apiWrapper";
import { API_ENDPOINTS } from "../../../services/api/apiEndpoints";

export default function ProductsTest() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.PRODUCTS);
        setProducts(res);
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Dummy Products (Test API)</h1>
      {products.slice(0, 5).map((p) => (
        <div
          key={p.id}
          style={{ border: "1px solid #ccc", marginTop: 10, padding: 10 }}
        >
          <h3>{p.title}</h3>
          <p>{p.body}</p>
        </div>
      ))}
    </div>
  );
}
