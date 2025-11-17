import { refs } from './refs';
import { getCartItem, getDarkTheme, getWishlistItem } from './storage';

export function showLoadMoreButton() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

export function hideLoadMoreButton() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

export function showLoader() {
  refs.loader.classList.add('visible');
}

export function hideLoader() {
  refs.loader.classList.remove('visible');
}

export function initializeTheme() {
  const savedTheme = getDarkTheme();

  if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    refs.darkThemeBtn.innerHTML = '&#9790;';
  } else {
    document.body.removeAttribute('data-theme');
    refs.darkThemeBtn.innerHTML = '&#9728;';
  }
}

export function scrollNextPart() {
  const firstNewCart = document.querySelector('.products__item');

  if (firstNewCart) {
    const cartHeight = firstNewCart.getBoundingClientRect().height;

    window.scrollBy({
      top: cartHeight * 3,
      behavior: 'smooth',
    });
  }
}

export function updateCartCount() {
  const currentCart = getCartItem();
  const count = currentCart.length;

  if (refs.navCartCount) {
    refs.navCartCount.textContent = count;
  }

  if (refs.summaryCartCount) {
    refs.summaryCartCount.textContent = count;
  }
}
export function updateWishlistCount() {
  const currentWishlist = getWishlistItem();
  const count = currentWishlist.length;

  if (refs.navWishlistCount) {
    refs.navWishlistCount.textContent = count;
  }
}

export function updateOrderSummary(productsData) {
  const totalPrice = productsData.reduce((acc, product) => {
    return acc + product.price * product.quantity;
  }, 0);

  refs.summaryTotalPrice.textContent = `$ ${totalPrice.toFixed(2)}`;
}
