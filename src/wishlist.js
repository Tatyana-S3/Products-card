import iziToast from 'izitoast';
import {
  addToCartHandler,
  addToWishlistHandler,
  productsListHandler,
  updateWishlistCount,
} from './js/handlers';
import { renderProducts } from './js/render-function';
import { getWishlistItem } from './js/storage';
import { getProductsById } from './js/products-api';
import { refs } from './js/refs';
import { toggleModal } from './js/modal';

document.addEventListener('DOMContentLoaded', initializeWishlistPage);

async function initializeWishlistPage() {
  updateWishlistCount();
  const productIds = getWishlistItem();

  if (!productIds || productIds.length === 0) {
    iziToast.info({
      message: 'Wishlist is empty',
    });
    return;
  }

  try {
    const productPromises = productIds.map(id => getProductsById(id));
    const productsData = await Promise.all(productPromises);
    renderProducts(productsData);

    if (refs.productsList) {
      refs.productsList.addEventListener('click', productsListHandler);
      refs.modalCloseBtn.addEventListener('click', toggleModal);
    }
    if (refs.modalCartBtn) {
      refs.modalCartBtn.addEventListener('click', addToCartHandler);
    }
    if (refs.modalWishlistBtn) {
      refs.modalWishlistBtn.addEventListener('click', addToWishlistHandler);
    }
  } catch (error) {
    iziToast.error({
      message: 'Error loading items from Wishlist',
    });
  }
}
