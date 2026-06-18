// simple read/write helpers for our "database" (just json files)
const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, '..', 'data', 'products.json');
const ordersFile = path.join(__dirname, '..', 'data', 'orders.json');

function readProducts() {
  const raw = fs.readFileSync(productsFile, 'utf-8');
  return JSON.parse(raw);
}

function writeProducts(products) {
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

function readOrders() {
  const raw = fs.readFileSync(ordersFile, 'utf-8');
  return JSON.parse(raw);
}

function writeOrders(orders) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

// good enough id generator for a project like this, don't need uuid
function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

module.exports = {
  readProducts,
  writeProducts,
  readOrders,
  writeOrders,
  makeId,
};
