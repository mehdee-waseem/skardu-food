import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api';

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts('balti')
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="page-header">
        <h1>Balti Dishes</h1>
        <p>Traditional Skardu meals, cooked fresh and ready for delivery.</p>
      </div>

      {loading && <p className="status-text">Loading menu...</p>}
      {error && <p className="status-text error">{error}</p>}

      {!loading && !error && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
