import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

export async function fetchProducts() {
  const response = await axios.get(`${API_BASE_URL}/products`);
  return response.data;
}

export async function createOrder(orderData) {
  const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}
