import { useEffect, useState } from "react";
import { api } from "../../../services/api/apiWrapper";
import { API_ENDPOINTS } from "../../../services/api/apiEndpoints";
import Loading from "@/shared/components/Loading";

interface Product {
  id: number;
  title: string;
  body: string;
}

export default function ProductsTest() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<Product[]>(API_ENDPOINTS.PRODUCTS);
        setProducts(res);
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <Loading />;

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
