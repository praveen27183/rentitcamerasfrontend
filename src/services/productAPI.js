import { apiClient } from "../utils/apiClient";

export async function fetchProducts() {
  return await apiClient.get("/products");
}

export async function createOrder(orderData) {
  return await apiClient.post("/orders", orderData);
}
