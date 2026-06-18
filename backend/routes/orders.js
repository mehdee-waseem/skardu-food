const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { readOrders, writeOrders, readProducts, makeId } = require('../utils/storage');

// POST /api/orders  -> customer places an order
// body: { customerName, phone, address, notes, items: [{ productId, qty }] }
router.post('/', (req, res) => {
  const { customerName, phone, address, notes, items } = req.body;

  if (!customerName || !phone || !address) {
    return res.status(400).json({ error: 'Name, phone and address are required' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const products = readProducts();
  let total = 0;
  const orderItems = [];

  // recalculate everything from the products file instead of trusting
  // whatever price the frontend sends us
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);

    if (!product) {
      return res.status(400).json({ error: `Product ${item.productId} no longer exists` });
    }

    const qty = Number(item.qty) || 1;
    const lineTotal = product.price * qty;
    total += lineTotal;

    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty,
    });
  }

  const orders = readOrders();

  const newOrder = {
    id: makeId(),
    customerName,
    phone,
    address,
    notes: notes || '',
    items: orderItems,
    total,
    status: 'pending', // pending -> confirmed -> delivered (or cancelled)
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  writeOrders(orders);

  res.status(201).json(newOrder);
});

// GET /api/orders -> admin only, list all orders (most recent first)
router.get('/', adminAuth, (req, res) => {
  const orders = readOrders();
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

// PATCH /api/orders/:id -> admin updates order status
router.patch('/:id', adminAuth, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const orders = readOrders();
  const index = orders.findIndex((o) => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  orders[index].status = status;
  writeOrders(orders);

  res.json(orders[index]);
});

module.exports = router;
