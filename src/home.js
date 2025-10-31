import {
  addToCartHandler,
  addToWishlistHandler,
  categoriesListHandler,
  handleLoadNext,
  initializeHomePage,
  productsListHandler,
  searchClearHandler,
  searchFormSubmit,
} from './js/handlers';
import { closeModal, toggleModal } from './js/modal';
import { refs } from './js/refs';

document.addEventListener('DOMContentLoaded', initializeHomePage);

refs.categoriesList.addEventListener('click', categoriesListHandler);
refs.productsList.addEventListener('click', productsListHandler);

refs.searchForm.addEventListener('submit', searchFormSubmit);
refs.searchClearBtn.addEventListener('click', searchClearHandler);

refs.loadMoreBtn.addEventListener('click', handleLoadNext);

refs.modalCloseBtn.addEventListener('click', closeModal);
refs.modalCartBtn.addEventListener('click', addToCartHandler);
refs.modalWishlistBtn.addEventListener('click', addToWishlistHandler);

document.addEventListener('keydown', event => {
  if (event.code === 'Escape') {
    toggleModal();
  }
});
