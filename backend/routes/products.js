const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { readProducts, writeProducts, makeId } = require('../utils/storage');

// GET /api/products  -> everyone can see the menu
// optional ?category=balti or ?category=dry
router.get('/', (req, res) => {
  const products = readProducts();
  const { category } = req.query;

  if (category) {
    return res.json(products.filter((p) => p.category === category));
  }

  res.json(products);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const products = readProducts();
  const product = products.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

// everything below here is admin only -----------------

// POST /api/products
router.post('/', adminAuth, (req, res) => {
  const { name, category, price, unit, icon, description, inStock } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ error: 'name, category and price are required' });
  }

  const products = readProducts();

  const newProduct = {
    id: makeId(),
    name,
    category,
    price: Number(price),
    unit: unit || 'item',
    icon: icon || '🍽️',
    description: description || '',
    inStock: inStock !== undefined ? inStock : true,
  };

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

// PUT /api/products/:id
router.put('/:id', adminAuth, (req, res) => {
  const products = readProducts();
  const index = products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    id: products[index].id, // don't let id be overwritten
  };

  writeProducts(products);
  res.json(products[index]);
});

// DELETE /api/products/:id
router.delete('/:id', adminAuth, (req, res) => {
  const products = readProducts();
  const filtered = products.filter((p) => p.id !== req.params.id);

  if (filtered.length === products.length) {
    return res.status(404).json({ error: 'Product not found' });
  }

  writeProducts(filtered);
  res.json({ message: 'Product deleted' });
});

module.exports = router;
