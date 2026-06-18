import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-tag">Rs {product.price}</div>

      <div className="product-icon">{product.icon}</div>
      <h3>{product.name}</h3>
      <p className="product-unit">per {product.unit}</p>
      <p className="product-desc">{product.description}</p>

      {product.inStock ? (
        <button className="btn btn-primary" onClick={() => addToCart(product)}>
          Add to cart
        </button>
      ) : (
        <button className="btn btn-disabled" disabled>
          Out of stock
        </button>
      )}
    </div>
  );
}
