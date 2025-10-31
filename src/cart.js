import iziToast from 'izitoast';
import { updateCartCount } from './js/handlers';
import { getProductsById } from './js/products-api';
import { refs } from './js/refs';
import { renderProducts } from './js/render-function';
import { getCartItem } from './js/storage';

document.addEventListener('DOMContentLoaded', initializeCartPage);

async function initializeCartPage() {
  updateCartCount();
  const productIds = getCartItem();

  if (!productIds || productIds.length === 0) {
    refs.divNotFound.classList.add('not-found--visible');
  }

  try {
    const productPromises = productIds.map(id => getProductsById(id));
    const productsData = await Promise.all(productPromises);
    renderProducts(productsData);
  } catch (error) {
    iziToast.error({
      message: 'Error loading items in shopping cart!',
    });
  }
}
