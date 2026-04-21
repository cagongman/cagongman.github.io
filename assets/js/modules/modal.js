export function initModal() {
  const testimonialsItems = document.querySelectorAll('[data-testimonials-item]');
  const modalContainer = document.querySelector('[data-modal-container]');
  const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
  const overlay = document.querySelector('[data-overlay]');
  const modalImg = document.querySelector('[data-modal-img]');
  const modalTitle = document.querySelector('[data-modal-title]');
  const modalText = document.querySelector('[data-modal-text]');

  if (!modalContainer || !modalCloseBtn || !overlay) return;

  const toggleModal = () => {
    modalContainer.classList.toggle('active');
    overlay.classList.toggle('active');
  };

  testimonialsItems.forEach(item => {
    item.addEventListener('click', function () {
      modalImg.src = this.querySelector('[data-testimonials-avatar]').src;
      modalImg.alt = this.querySelector('[data-testimonials-avatar]').alt;
      modalTitle.innerHTML = this.querySelector('[data-testimonials-title]').innerHTML;
      modalText.innerHTML = this.querySelector('[data-testimonials-text]').innerHTML;
      toggleModal();
    });
  });

  modalCloseBtn.addEventListener('click', toggleModal);
  overlay.addEventListener('click', toggleModal);
}
