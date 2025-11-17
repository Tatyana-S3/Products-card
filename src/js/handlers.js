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
  initializeTheme,
  scrollNextPart,
  showLoader,
  showLoadMoreButton,
  updateCartCount,
  updateWishlistCount,
} from './helpers';
import { toggleModal } from './modal';
import { getCartItem, getWishlistItem, saveToLocalStorage } from './storage';
import { initializeCartPage } from '../cart';

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

export function toggleTheme() {
  const isDark = document.body.hasAttribute('data-theme');
  let newTheme;

  if (isDark) {
    document.body.removeAttribute('data-theme');
    newTheme = 'light';
  } else {
    document.body.setAttribute('data-theme', 'dark');
    newTheme = 'dark';
  }
  saveToLocalStorage(STORAGE_KEY.THEME, newTheme);

  refs.darkThemeBtn.innerHTML = newTheme === 'dark' ? '&#9790;' : '&#9728;';
}

export async function initializeHomePage() {
  initializeTheme();
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
  if (event.target.closest('[data-action]')) {
    return;
  }
  const productCart = event.target.closest('.products__item');

  if (!productCart) return;

  if (refs.modalCartBtn) {
    refs.modalCartBtn.style.display = '';
  }
  if (refs.modalWishlistBtn) {
    refs.modalWishlistBtn.style.display = '';
  }

  const id = productCart.dataset.id;

  try {
    const product = await getProductsById(id);
    renderModalProducts(product);
    toggleModal();

    refs.modalCartBtn.dataset.id = id;
    refs.modalWishlistBtn.dataset.id = id;

    const currentCart = getCartItem();
    const isProductInCart = currentCart.some(item => item.id === id);

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

export async function addToCartHandler(evt) {
  const productId = evt.target.dataset.id;

  if (!productId) {
    return;
  }

  const currentCart = getCartItem();

  const itemIndex = currentCart.findIndex(item => item.id === productId);

  if (itemIndex === -1) {
    currentCart.push({ id: productId, quantity: 1 });
    refs.modalCartBtn.textContent = 'Remove from cart';
  } else {
    currentCart.splice(itemIndex, 1);
    refs.modalCartBtn.textContent = 'Add to cart';
  }

  saveToLocalStorage(STORAGE_KEY.CART, currentCart);

  updateCartCount();
}

export function handleBuyProducts(productsData) {
  openCheckoutModal(productsData);
}

// export function handleFinalCheckout(allProductsInCart) {
//   const checkedCheckBoxes = document.querySelectorAll(
//     '.checkout-checkbox:checked'
//   );

//   if (checkedCheckBoxes.length === 0) {
//     iziToast.warning({
//       message: 'Please select at least one item to purchase.',
//     });
//     return;
//   }

//   const selectedProductIds = new Set();
//   checkedCheckBoxes.forEach(checkbox => {
//     selectedProductIds.add(checkbox.dataset.id);
//   });

//   const updateCart = allProductsInCart.filter(
//     item => !selectedProductIds.has(item.id)
//   );

//   saveToLocalStorage(STORAGE_KEY.CART, updateCart);

//   toggleModal();
//   updateCartCount();
//   initializeCartPage();

//   iziToast.success({
//     title: 'Success!',
//     message:
//       'Your order has been successfully placed! Your basket has been updated.',
//   });
// }

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
    // iziToast.info({
    //   message: 'Item added to your Wishlist!',
    // });

    updateWishlistCount();
  } else {
    currentWishlist.splice(productIndex, 1);
    saveToLocalStorage(STORAGE_KEY.WISHLIST, currentWishlist);
    refs.modalWishlistBtn.textContent = 'Add to Wishlist';

    // iziToast.info({
    //   message: 'Item removed from your Wishlist!',
    // });

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
