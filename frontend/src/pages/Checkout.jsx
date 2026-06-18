import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({ customerName: '', phone: '', address: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setSubmitting(true);

    try {
      const orderItems = items.map((item) => ({ productId: item.id, qty: item.qty }));
      const order = await placeOrder({ ...form, items: orderItems });

      clearCart();
      navigate('/order-success', { state: { order } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="empty-state">
          <h2>Nothing to check out</h2>
          <p>Your cart is empty right now.</p>
          <Link to="/menu" className="btn btn-primary">Browse the menu</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section checkout-section">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input name="customerName" value={form.customerName} onChange={handleChange} required />
          </label>

          <label>
            Phone number
            <input name="phone" value={form.phone} onChange={handleChange} required />
          </label>

          <label>
            Delivery address
            <textarea name="address" value={form.address} onChange={handleChange} rows="3" required />
          </label>

          <label>
            Notes (optional)
            <textarea name="notes" value={form.notes} onChange={handleChange} rows="2" placeholder="e.g. less spicy, ring the bell, etc." />
          </label>

          {error && <p className="status-text error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Placing order...' : `Place order - Rs ${total}`}
          </button>

          <p className="checkout-note">Payment is cash on delivery. We'll call to confirm your order.</p>
        </form>

        <div className="order-summary">
          <h3>Order summary</h3>
          {items.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>{item.icon} {item.name} x{item.qty}</span>
              <span>Rs {item.price * item.qty}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>Rs {total}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
