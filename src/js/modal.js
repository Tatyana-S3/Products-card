import { refs } from './refs';

export function toggleModal() {
  refs.modalWindow.classList.toggle('modal--is-open');
}

document.addEventListener('keydown', event => {
  if (event.code === 'Escape') {
    toggleModal();
  }
});
