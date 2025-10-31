import { refs } from './refs';

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
