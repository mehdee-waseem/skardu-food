const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

export async function getProducts(category) {
  const url = category ? `${API_URL}/products?category=${category}` : `${API_URL}/products`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function placeOrder(orderData) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return handleResponse(res);
}

export async function adminLogin(password) {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return handleResponse(res);
}

export async function getOrders(token) {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { 'x-admin-token': token },
  });
  return handleResponse(res);
}

export async function updateOrderStatus(token, orderId, status) {
  const res = await fetch(`${API_URL}/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function addProduct(token, product) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
    body: JSON.stringify(product),
  });
  return handleResponse(res);
}

export async function updateProduct(token, id, product) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
    body: JSON.stringify(product),
  });
  return handleResponse(res);
}

export async function deleteProduct(token, id) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-token': token },
  });
  return handleResponse(res);
}
