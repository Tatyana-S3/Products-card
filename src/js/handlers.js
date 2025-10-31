import axios from 'axios';
import {
  getCategories,
  getProducts,
  getProductsByCategories,
  getProductsById,
  getProductsBySearch,
} from './products-api';
import { refs } from './refs';
import {
  renderCategories,
  renderModalProducts,
  renderProducts,
} from './render-function';
import { LIMIT, STORAGE_KEY } from './constants';
import iziToast from 'izitoast';
import {
  hideLoader,
  hideLoadMoreButton,
  scrollNextPart,
  showLoader,
  showLoadMoreButton,
} from './helpers';
import { toggleModal } from './modal';
import { getCartItem, getWishlistItem, saveToLocalStorage } from './storage';

let currentPage = 1;
let totalPages = 0;
let activeCategory = 'All';
let activeSearch = '';

async function loadMoreProducts() {
  showLoader();
  refs.divNotFound.classList.remove('not-found--visible');

  try {
    let productsToRender = [];
    let totalItem = 0;

    const skip = (currentPage - 1) * LIMIT;
    const end = skip + LIMIT;

    if (activeSearch) {
      const searchData = await getProductsBySearch(activeSearch);
      totalItem = searchData.total;
      productsToRender = searchData.products.slice(skip, end);
    } else if (activeCategory === 'All') {
      const apiData = await getProducts(currentPage);
      totalItem = apiData.total;
      productsToRender = apiData.products;
    } else {
      const categoryProducts = await getProductsByCategories(activeCategory);
      totalItem = categoryProducts.length;
      productsToRender = categoryProducts.slice(skip, end);
    }

    if (currentPage === 1) {
      refs.productsList.innerHTML = '';
    }

    if (!productsToRender || productsToRender.length === 0) {
      refs.divNotFound.classList.add('not-found--visible');
      hideLoadMoreButton();
      return;
    }

    totalPages = Math.ceil(totalItem / LIMIT);

    renderProducts(productsToRender);

    if (currentPage > 1) {
      scrollNextPart();
    }

    if (currentPage < totalPages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Illegal operation',
    });
  } finally {
    hideLoader();
  }
}

export async function handleLoadNext() {
  currentPage++;
  await loadMoreProducts();
}

export async function initializeHomePage() {
  updateCartCount();
  updateWishlistCount();
  try {
    const categories = await getCategories();
    renderCategories(categories);

    currentPage = 1;
    activeCategory = 'All';

    await loadMoreProducts();
  } catch (error) {
    console.error('error initial home page', error);
  }
}

export async function categoriesListHandler(event) {
  if (event.target.tagName !== 'BUTTON') {
    return;
  }

  const allCategotyBtn =
    refs.categoriesList.querySelectorAll('.categories__btn');
  allCategotyBtn.forEach(btn => {
    btn.classList.remove('categories__btn--active');
  });

  try {
    const categoryBtn = event.target;
    const categoryName = categoryBtn.textContent.trim();

    activeCategory = categoryName;
    activeSearch = '';
    currentPage = 1;
    totalPages = 0;

    categoryBtn.classList.add('categories__btn--active');

    refs.productsList.innerHTML = '';
    refs.divNotFound.classList.remove('not-found--visible');

    await loadMoreProducts();
  } catch (error) {
    console.log(error.message);
  }
}

export async function productsListHandler(event) {
  const productCart = event.target.closest('.products__item');

  if (!productCart) return;

  const id = productCart.dataset.id;

  try {
    const product = await getProductsById(id);
    renderModalProducts(product);
    toggleModal();

    refs.modalCartBtn.dataset.id = id;
    refs.modalWishlistBtn.dataset.id = id;

    const currentCart = getCartItem();
    const isProductInCart = currentCart.includes(id);

    const currentWishlist = getWishlistItem();
    const isProductInWishlist = currentWishlist.includes(id);

    if (isProductInCart) {
      refs.modalCartBtn.textContent = 'Remove from cart';
    } else {
      refs.modalCartBtn.textContent = 'Add to cart';
    }

    if (isProductInWishlist) {
      refs.modalWishlistBtn.textContent = 'Remove from Wishlist';
    } else {
      refs.modalWishlistBtn.textContent = 'Add to Wishlist';
    }
  } catch (error) {
    iziToast.error({
      message: 'Error loading product',
    });
  }
}

export async function searchFormSubmit(event) {
  event.preventDefault();

  const query = refs.searchFormInput.value.trim().toLowerCase();
  if (!query) return;

  activeSearch = query;
  currentPage = 1;
  await loadMoreProducts();
  refs.searchForm.reset();
}

export async function searchClearHandler() {
  refs.searchFormInput.value = '';
  activeSearch = '';
  currentPage = 1;
  await loadMoreProducts();
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

export async function addToCartHandler(evt) {
  const productId = evt.target.dataset.id;

  if (!productId) {
    return;
  }

  const currentCart = getCartItem();

  const productIndex = currentCart.findIndex(id => id === productId);

  if (productIndex === -1) {
    currentCart.push(productId);
    saveToLocalStorage(STORAGE_KEY.CART, currentCart);

    refs.modalCartBtn.textContent = 'Remove from cart';
    iziToast.success({
      message: 'Item added to your basket!',
    });

    updateCartCount();
  } else {
    currentCart.splice(productIndex, 1);
    saveToLocalStorage(STORAGE_KEY.CART, currentCart);
    refs.modalCartBtn.textContent = 'Add to cart';

    updateCartCount();
  }
}

export async function addToWishlistHandler(evt) {
  const productId = evt.target.dataset.id;

  if (!productId) {
    return;
  }

  const currentWishlist = getWishlistItem();

  const productIndex = currentWishlist.findIndex(id => id === productId);

  if (productIndex === -1) {
    currentWishlist.push(productId);
    saveToLocalStorage(STORAGE_KEY.WISHLIST, currentWishlist);
    refs.modalWishlistBtn.textContent = 'Remove from Wishlist';
    iziToast.success({
      message: 'Item added to your Wishlist!',
    });

    updateWishlistCount();
  } else {
    currentWishlist.splice(productIndex, 1);
    saveToLocalStorage(STORAGE_KEY.WISHLIST, currentWishlist);
    refs.modalWishlistBtn.textContent = 'Add to Wishlist';

    iziToast.info({
      message: 'Item removed from your Wishlist!',
    });

    updateWishlistCount();

    if (refs.productsList) {
      const productCardToRemove = refs.productsList.querySelector(
        `.products__item[data-id="${productId}"]`
      );

      if (productCardToRemove) {
        productCardToRemove.remove();

        if (currentWishlist.length === 0) {
          refs.divNotFound.classList.add('not-found--visible');
        }
      }
    }
  }
}
