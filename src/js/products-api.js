import axios from 'axios';
import { BASE_URL, ENDPOINTS, LIMIT } from './constants';

axios.defaults.baseURL = BASE_URL;

export async function getCategories() {
  const response = await axios.get(ENDPOINTS.CATEGORIES);
  return response.data;
}

export async function getProducts(currentPage) {
  const params = {
    limit: LIMIT,
    skip: (currentPage - 1) * LIMIT,
  };

  const response = await axios.get(ENDPOINTS.PRODUCTS, { params });
  return response.data;
}

export async function getProductsById(id) {
  const response = await axios.get(`${ENDPOINTS.PRODUCTS_ID}${id}`);
  return response.data;
}

export async function getProductsBySearch(product) {
  const params = {
    q: product,
  };

  const response = await axios.get(ENDPOINTS.SEARCH, { params });
  return response.data;
}

export async function getProductsByCategories(category) {
  const response = await axios.get(`${ENDPOINTS.PRODUCTS_CATEGORY}${category}`);
  return response.data.products;
}
