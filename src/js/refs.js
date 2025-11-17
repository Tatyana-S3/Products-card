export const refs = {
  categoriesList: document.querySelector('.categories'),
  productsList: document.querySelector('.products'),
  categoriesBtn: document.querySelector('.categories__btn'),
  divNotFound: document.querySelector('.not-found'),

  // ---------------HELPERS--------------------
  loadMoreBtn: document.querySelector('.load-more-btn'),
  loader: document.querySelector('.loader'),
  darkThemeBtn: document.querySelector('.theme-toggle-btn'),

  // ---------------MODAL WINDOW--------------------
  modalWindow: document.querySelector('.modal'),
  modalCloseBtn: document.querySelector('.modal__close-btn'),
  modalProduct: document.querySelector('.modal-product'),
  modalCartBtn: document.querySelector('.modal-product__btn--cart'),
  modalWishlistBtn: document.querySelector('.modal-product__btn--wishlist'),

  // ---------------SEARCH FORM--------------------
  searchForm: document.querySelector('.search-form'),
  searchClearBtn: document.querySelector('.search-form__btn-clear'),
  searchFormInput: document.querySelector('.search-form__input'),
  //---------------Cart-------------
  navCartCount: document.querySelector('.nav__count[data-cart-count]'),
  summaryCartCount: document.querySelector('.cart-summary__value[data-count]'),
  summaryTotalPrice: document.querySelector('.cart-summary__value[data-price]'),
  buyBtn: document.querySelector('.cart-summary__btn'),

  //-------------Wishlist-----------
  navWishlistCount: document.querySelector('.nav__count[data-wishlist-count]'),
};
