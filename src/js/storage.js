import { STORAGE_KEY } from './constants';

export function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log(`Error saving data to LocalStorege:`, error.message);
  }
}

export function getFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.log(`Error getting data from LS: ${error.message}`);
    return null;
  }
}

export function getCartItem() {
  return getFromLocalStorage(STORAGE_KEY.CART) || [];
}

export function getWishlistItem() {
  return getFromLocalStorage(STORAGE_KEY.WISHLIST) || [];
}
