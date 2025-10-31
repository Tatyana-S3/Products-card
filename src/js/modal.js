import { refs } from './refs';

export function toggleModal() {
  refs.modalWindow.classList.toggle('modal--is-open');
}
export function closeModal() {
  toggleModal();
}

// document.addEventListener('keydown', event => {
//   if (event.code === 'Escape') {
//     toggleModal();
//   }
// });
