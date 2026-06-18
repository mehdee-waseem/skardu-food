import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeFromCart, updateQty, total } = useCart();

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="empty-state">
          <p className="empty-icon">🛒</p>
          <h2>Your cart is empty</h2>
          <p>Add some Balti dishes or dry foods to get started.</p>
          <Link to="/menu" className="btn btn-primary">
            Browse the menu
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <h1>Your Cart</h1>

      <div className="cart-table">
        {items.map((item) => (
          <div className="cart-row" key={item.id}>
            <span className="cart-icon">{item.icon}</span>

            <div className="cart-row-info">
              <strong>{item.name}</strong>
              <span>Rs {item.price} / {item.unit}</span>
            </div>

            <div className="qty-control">
              <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
            </div>

            <span className="cart-line-total">Rs {item.price * item.qty}</span>

            <button className="remove-btn" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <span>Total</span>
        <strong>Rs {total}</strong>
      </div>

      <Link to="/checkout" className="btn btn-primary btn-block">
        Proceed to checkout
      </Link>
    </section>
  );
}
