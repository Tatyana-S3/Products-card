import { refs } from './refs';

export function renderCategories(categories) {
  const categoriesAll = ['All', ...categories];

  const markup = categoriesAll
    .map(
      category => `
        <li class="categories__item">
   <button class="categories__btn" type="button">${category}</button>
 </li>
            `
    )
    .join('');
  refs.categoriesList.insertAdjacentHTML('beforeend', markup);
}

export function renderProducts(products) {
  const markup = products
    .map(
      ({ id, thumbnail, description, title, brand, category, price }) => `
        <li class="products__item" data-id="${id}">
    <img class="products__image" src="${thumbnail}" alt="${description}"/>
    <p class="products__title">${title}</p>
    <p class="products__brand"><span class="products__brand--bold">Brand:${brand}</span></p>
    <p class="products__category">Category: ${category}</p>
    <p class="products__price">Price: ${price}$</p>
 </li>
            `
    )
    .join('');
  refs.productsList.insertAdjacentHTML('beforeend', markup);
}

export function renderModalProducts({
  id,
  thumbnail,
  description,
  title,
  returnPolicy,
  shippingInformation,
  price,
}) {
  const markup = `
  <img class="modal-product__img" src="${thumbnail}" alt="${description}" />
      <div class="modal-product__content" data-id='${id}'>
        <p class="modal-product__title">${title}</p>
        <ul class="modal-product__tags"></ul>
        <p class="modal-product__description">${description}</p>
        <p class="modal-product__shipping-information">Shipping:${shippingInformation}</p>
        <p class="modal-product__return-policy">Return Policy:${returnPolicy}</p>
        <p class="modal-product__price">Price:${price} $</p>

        <button class="modal-product__buy-btn" type="button" data-id="${id}">Buy</button>
      </div>
  `;
  refs.modalProduct.innerHTML = markup;
}

export function renderCartProducts(products) {
  const markup = products
    .map(
      ({
        id,
        thumbnail,
        description,
        title,
        brand,
        category,
        price,
        quantity,
      }) => {
        const itemTotal = (price * quantity).toFixed(2);
        return `<li class="products__item cart-item" data-id="${id}">
              <img class="products__image" src="${thumbnail}" alt="${description}"/>
              <div class="product__info">
                  <p class="products__title">${title}</p>
                  <p class="products__brand"><span class="products__brand--bold">Brand:${brand}</span></p>
                  <p class="products__category">Category: ${category}</p>
                  <p class="products__price">Price: ${price}$</p>

                <p class="product-total-price">Total: 
                   <span class="total-price-value">${itemTotal}</span>$ 
                </p> 

              <div class="product__quantity-control" data-id="${id}" data-price="${price}">
                  <button type="button" class="quantity-btn" data-action="decrement">-</button>
                  <input type="number" class="quantity-input" value="${quantity}" min="1">
                  <button type="button" class="quantity-btn" data-action="increment">+</button>
              </div>

              </div>
          </li>
  `;
      }
    )
    .join('');
  refs.productsList.innerHTML = markup;
}

// export function renderCheckoutItem({ id, title, price, quantity, thumbnail }) {
//   const itemTotal = (price * quantity).toFixed(2);

//   return `
//   <li class="checkout-item" data-id="${id}" data-price="${price}" data-quantity="${quantity}">
//             <div class="checkout-product-image-wrapper">
//                 <img src="${thumbnail}" alt="${title}" class="checkout-product-image" loading="lazy">
//             </div>

//             <div class="checkout-product-info">
//                 <h3 class="checkout-product-title">${title}</h3>

//                 <div class="checkout-details-row">
//                     <p class="checkout-quantity-label">Количество:</p>
//                     <p class="checkout-quantity-value">${quantity} шт.</p>
//                 </div>

//                 <div class="checkout-price-row">
//                     <p class="checkout-price-label">Цена:</p>
//                     <p class="checkout-price-value">${itemTotal}$</p>
//                 </div>
//             </div>

//             <div class="checkout-selection">
//                 <label class="checkout-label-checkbox">
//                     <input type="checkbox" class="checkout-checkbox" checked data-id="${id}">
//                     <span class="checkout-custom-checkbox"></span>
//                 </label>
//             </div>
//         </li>
//   `;
// }

// export function generateCheckoutMarkup(products) {
//   const itemsMarkup = products.map(renderCheckoutItem).join('');
//   const initialTotal = products
//     .reduce((acc, p) => acc + p.price * p.quantity, 0)
//     .toFixed(2);

//   return `
//         <div class="checkout-content">
//           <h2 class="checkout-title">Оформление заказа</h2>
//             <label class="checkout-select-all-label">
//               <input type="checkbox" id="select-all-checkbox" checked>
//               <span>Выбрать все товары (${products.length})</span>
//             </label>
//             <ul class="checkout-list">${itemsMarkup}</ul>
//              <div class="checkout-summary">
//                 <p>Общая сумма:</p>
//                 <p class="checkout-total-price">
//                     <span id="current-checkout-total">${initialTotal}</span>$
//                 </p>
//              </div>
//           <button type="button" class="checkout-buy-final-btn">Buy selected</button>
//           <button type="button" class="checkout-close-btn">Cancel</button>
//         </div>
//   `;
// }
