import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  getOrders,
  updateOrderStatus,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../api';

const STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const token = localStorage.getItem('skardu-admin-token');
  const navigate = useNavigate();

  const [tab, setTab] = useState('orders');

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'balti',
    price: '',
    unit: '',
    icon: '🍽️',
    description: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (!token) return; // will redirect below
    loadData();
  }, [token]);

  function loadData() {
    setLoading(true);
    Promise.all([getOrders(token), getProducts()])
      .then(([ordersData, productsData]) => {
        setOrders(ordersData);
        setProducts(productsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  function handleLogout() {
    localStorage.removeItem('skardu-admin-token');
    navigate('/admin/login');
  }

  async function handleStatusChange(orderId, status) {
    try {
      await updateOrderStatus(token, orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    try {
      const created = await addProduct(token, {
        ...newProduct,
        price: Number(newProduct.price),
      });
      setProducts((prev) => [...prev, created]);
      setNewProduct({ name: '', category: 'balti', price: '', unit: '', icon: '🍽️', description: '' });
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(token, id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  function startEdit(product) {
    setEditingId(product.id);
    setEditForm(product);
  }

  async function saveEdit() {
    try {
      const updated = await updateProduct(token, editingId, {
        ...editForm,
        price: Number(editForm.price),
      });
      setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      setEditingId(null);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <section className="section">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
      </div>

      <div className="admin-tabs">
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>
          Orders ({orders.length})
        </button>
        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>
          Products ({products.length})
        </button>
      </div>

      {loading && <p className="status-text">Loading...</p>}
      {error && <p className="status-text error">{error}</p>}

      {!loading && tab === 'orders' && (
        <div className="admin-orders">
          {orders.length === 0 && <p>No orders yet.</p>}

          {orders.map((order) => (
            <div className="admin-order-card" key={order.id}>
              <div className="admin-order-top">
                <div>
                  <strong>{order.customerName}</strong> - {order.phone}
                  <p className="order-address">{order.address}</p>
                </div>
                <span className={`status-pill status-${order.status}`}>{order.status}</span>
              </div>

              <ul className="order-items-list">
                {order.items.map((item, i) => (
                  <li key={i}>{item.name} x{item.qty} - Rs {item.price * item.qty}</li>
                ))}
              </ul>

              {order.notes && <p className="order-notes">Note: {order.notes}</p>}

              <div className="admin-order-bottom">
                <strong>Total: Rs {order.total}</strong>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === 'products' && (
        <div className="admin-products">
          <form className="add-product-form" onSubmit={handleAddProduct}>
            <h3>Add new product</h3>
            <div className="form-grid">
              <input
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                <option value="balti">Balti dish</option>
                <option value="dry">Dry food</option>
              </select>
              <input
                placeholder="Price (Rs)"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
              <input
                placeholder="Unit (e.g. kg, plate)"
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
              />
              <input
                placeholder="Icon (emoji)"
                value={newProduct.icon}
                onChange={(e) => setNewProduct({ ...newProduct, icon: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              rows="2"
            />
            <button type="submit" className="btn btn-primary">Add product</button>
          </form>

          <div className="admin-product-list">
            {products.map((product) =>
              editingId === product.id ? (
                <div className="admin-product-row editing" key={product.id}>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  />
                  <input
                    value={editForm.unit}
                    onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                  />
                  <label className="instock-label">
                    <input
                      type="checkbox"
                      checked={editForm.inStock}
                      onChange={(e) => setEditForm({ ...editForm, inStock: e.target.checked })}
                    />
                    In stock
                  </label>
                  <button className="btn btn-primary" onClick={saveEdit}>Save</button>
                  <button className="btn btn-outline" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <div className="admin-product-row" key={product.id}>
                  <span>{product.icon}</span>
                  <span className="grow">{product.name}</span>
                  <span>Rs {product.price}/{product.unit}</span>
                  <span>{product.inStock ? 'In stock' : 'Out of stock'}</span>
                  <button className="btn btn-outline" onClick={() => startEdit(product)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </section>
  );
}
