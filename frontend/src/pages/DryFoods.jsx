import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api';

export default function DryFoods() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts('dry')
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="page-header">
        <h1>Dry Foods</h1>
        <p>Sun-dried apricots, walnuts, mulberries and apricot oil straight from Baltistan orchards.</p>
      </div>

      {loading && <p className="status-text">Loading products...</p>}
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
