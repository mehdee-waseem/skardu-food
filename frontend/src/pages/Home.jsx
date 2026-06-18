import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts()
      .then((products) => setFeatured(products.slice(0, 4)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="hero-eyebrow">Gilgit-Baltistan, Pakistan</p>
          <h1>Real food from Skardu, delivered to your door.</h1>
          <p className="hero-sub">
            Mamtu, Balay, Khambir, butter tea and the dry fruits the valley is
            known for - made the way our grandmothers made it, packed fresh
            and shipped out from Skardu.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="btn btn-primary">
              Order Balti dishes
            </Link>
            <Link to="/dry-foods" className="btn btn-outline">
              Shop dry foods
            </Link>
          </div>
        </div>
      </section>

      <div className="mountain-divider" aria-hidden="true">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,120 L0,70 L120,30 L230,75 L340,15 L470,80 L600,5 L740,65 L860,25 L980,80 L1100,35 L1200,70 L1200,120 Z" />
        </svg>
      </div>

      <section className="section">
        <h2 className="section-title">Popular right now</h2>

        {loading && <p className="status-text">Loading menu...</p>}
        {error && <p className="status-text error">{error}</p>}

        {!loading && !error && (
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="section about-strip">
        <div className="about-card">
          <h3>🏞️ From the valley</h3>
          <p>
            Baltistan sits between some of the highest mountains on earth.
            Our apricots, walnuts and mulberries are dried the traditional
            way, on rooftops under the sun, with nothing added.
          </p>
        </div>
        <div className="about-card">
          <h3>👵 Home-style recipes</h3>
          <p>
            Mamtu, Balay and Chapshoro are cooked in small batches using
            recipes passed down through generations of Balti households.
          </p>
        </div>
        <div className="about-card">
          <h3>🚚 Cash on delivery</h3>
          <p>
            Place your order, we'll call to confirm, and you pay when it
            reaches your door. No online payment needed.
          </p>
        </div>
      </section>
    </>
  );
}
