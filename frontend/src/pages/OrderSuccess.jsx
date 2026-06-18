import { useLocation, Link, Navigate } from 'react-router-dom';

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    // someone landed here directly without placing an order
    return <Navigate to="/" />;
  }

  return (
    <section className="section">
      <div className="empty-state">
        <p className="empty-icon">✅</p>
        <h2>Order received!</h2>
        <p>
          Thanks {order.customerName}, your order <strong>#{order.id}</strong> of Rs {order.total} has
          been placed. We'll call you on {order.phone} shortly to confirm.
        </p>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </div>
    </section>
  );
}
