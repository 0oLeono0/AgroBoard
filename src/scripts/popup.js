import { openModal, closeModal } from "./modal.js";

export const initPopupListeners = () => {
  const popups = document.querySelectorAll(".popup");
  const closeBtns = document.querySelectorAll(".popup__close");

  closeBtns.forEach((btn) => {
    const popup = btn.closest(".popup");
    btn.addEventListener("click", () => closeModal(popup));
  });

  popups.forEach((popup) => {
    popup.addEventListener("mousedown", (evt) => {
      if (evt.target === popup) closeModal(popup);
    });
  });
};

export const addPopupOpenListener = (button, popup) => {
  button.addEventListener("click", () => openModal(popup));
};
