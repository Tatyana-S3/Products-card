import iziToast from 'izitoast';
import { getProductsById } from './js/products-api';
import { refs } from './js/refs';
import {
  // generateCheckoutMarkup,
  renderCartProducts,
} from './js/render-function';
import { getCartItem, saveToLocalStorage } from './js/storage';
import {
  initializeTheme,
  updateCartCount,
  updateOrderSummary,
  updateWishlistCount,
} from './js/helpers';
import { handleBuyProducts, toggleTheme } from './js/handlers';
import { STORAGE_KEY } from './js/constants';

let cartProductsData = [];

if (document.querySelector('.js-cart-page')) {
  document.addEventListener('DOMContentLoaded', () => {
    refs.darkThemeBtn.addEventListener('click', toggleTheme);
    initializeCartPage();
  });
}

export async function initializeCartPage() {
  updateCartCount();
  updateWishlistCount();
  initializeTheme();

  const cartItems = getCartItem();
  const isCartEmpty = !cartItems || cartItems.length === 0;

  refs.productsList.innerHTML = '';

  if (isCartEmpty) {
    refs.divNotFound.classList.add('not-found--visible');
    refs.productsList.innerHTML =
      '<p class="cart-empty-message">Your basket is empty.</p>';
    updateOrderSummary([]);
    return;
  }

  refs.divNotFound.classList.remove('not-found--visible');

  try {
    const productPromises = cartItems.map(item =>
      getProductsById(Number(item.id))
    );
    const fetchedProducts = await Promise.all(productPromises);

    cartProductsData = fetchedProducts.map(product => {
      const cartItem = cartItems.find(item => item.id === product.id);
      return { ...product, quantity: cartItem ? cartItem.quantity : 1 };
    });

    renderCartProducts(cartProductsData);
    updateOrderSummary(cartProductsData);

    const newList = refs.productsList.cloneNode(true);
    refs.productsList.parentNode.replaceChild(newList, refs.productsList);
    refs.productsList = newList;

    refs.productsList.addEventListener('click', handleQuantityChange);
    refs.productsList.addEventListener('click', productsListHandler);

    refs.buyBtn.onclick = () => handleBuyProducts(cartProductsData);
  } catch (error) {
    iziToast.error({
      message: 'Error loading items in shopping cart!',
    });
  }
}

export function handleQuantityChange(evt) {
  evt.stopPropagation();

  const target = evt.target;
  const action = target.dataset.action;

  if (action !== 'increment' && action !== 'decrement') {
    return;
  }

  const quantityControl = target.closest('.product__quantity-control');
  if (!quantityControl) return;

  const productId = quantityControl.dataset.id;
  const productPrice = parseFloat(quantityControl.dataset.price);

  // const numericProductId = Number(productId);

  const quantityInput = quantityControl.querySelector('.quantity-input');
  const productItem = target.closest('.cart-item');

  const singleTotalElementValue =
    productItem.querySelector('.total-price-value');

  if (!quantityInput || isNaN(productPrice)) return;

  let currentQuantity = parseInt(quantityInput.value);

  if (action === 'increment') {
    currentQuantity += 1;
  } else if (action === 'decrement' && currentQuantity > 1) {
    currentQuantity -= 1;
  } else {
    return;
  }

  let cartItems = getCartItem();
  const itemToUpdateInLS = cartItems.find(item => item.id == productId);

  if (itemToUpdateInLS) {
    itemToUpdateInLS.quantity = currentQuantity;
    saveToLocalStorage(STORAGE_KEY.CART, cartItems);

    quantityInput.value = currentQuantity;

    const newTotal = productPrice * currentQuantity;
    if (singleTotalElementValue && !isNaN(newTotal)) {
      singleTotalElementValue.textContent = newTotal.toFixed(2);
    }

    const itemToUpDateInData = cartProductsData.find(
      item => item.id == productId
    );

    if (itemToUpDateInData) {
      itemToUpDateInData.quantity = currentQuantity;
      updateOrderSummary(cartProductsData);
    }
  } else {
    iziToast({
      message: 'Error: item not found in shopping cart.',
    });
  }
}

// export function updateCheckoutTotal() {
//   const checkboxes = document.querySelectorAll('.checkout-checkbox:checked');
//   let newTotal = 0;

//   checkboxes.forEach(checkbox => {
//     const itemElement = checkbox.closest('.checkout-item');
//     if (itemElement) {
//       const price = parseFloat(itemElement.dataset.price);
//       const quantity = parseInt(itemElement.dataset.quantity);
//       newTotal += price * quantity;
//     }
//   });
//   const totalElement = document.querySelector('#current-checkout-total');
//   if (totalElement) {
//     totalElement.textContent = newTotal.toFixed(2);
//   }
// }

// export function openCheckoutModal(productsWithQuantity) {
//   const markup = generateCheckoutMarkup(productsWithQuantity);

//   if (refs.modalProduct) {
//     refs.modalProduct.innerHTML = markup;
//     if (refs.modalCartBtn) {
//       refs.modalCartBtn.style.display = 'none';
//     }
//     if (refs.modalWishlistBtn) {
//       refs.modalWishlistBtn.style.display = 'none';
//     }
//     toggleModal();
//   }

//   const checkoutList = document.querySelector('.checkout-list');
//   const selectAllCheckbox = document.querySelector('#select-all-checkbox');
//   const finalBuyBtn = document.querySelector('.checkout-buy-final-btn');
//   const closeBtn = document.querySelector('.checkout-close-btn');

//   if (checkoutList) {
//     checkoutList.addEventListener('change', updateCheckoutTotal);
//   }
//   if (finalBuyBtn) {
//     finalBuyBtn.addEventListener('click', () =>
//       handleFinalCheckout(productsWithQuantity)
//     );
//   }

//   if (selectAllCheckbox && checkoutList) {
//     selectAllCheckbox.addEventListener('change', evt => {
//       const isChecked = evt.target.checked;
//       const itemCheckboxes =
//         checkoutList.querySelectorAll('.checkout-checkbox');
//       itemCheckboxes.forEach(checkbox => {
//         checkbox.checked = isChecked;
//       });
//       updateCheckoutTotal();
//     });
//   }

//   if (closeBtn) {
//     closeBtn.addEventListener('click', toggleModal);
//   }
// }
