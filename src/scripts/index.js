import "../pages/index.css";
import { openModal, closeModal } from "./modal.js";

const loginBtn = document.querySelector(".header__login");
const regBtn = document.querySelector(".header__reg");
const authPopap = document.querySelector(".popup_type_auth");
const regPopap = document.querySelector(".popup_type_reg");
const popups = document.querySelectorAll(".popup");
const closeBtns = document.querySelectorAll(".popup__close");

const loginFormElement = document.forms["login"];
const emailInput = loginFormElement.elements.email;
const passwordInput = loginFormElement.elements.password;

// Закрытие попапа по клику на крестик или оверлей
closeBtns.forEach((btn) => {
  const popup = btn.closest(".popup");
  btn.addEventListener("click", () => closeModal(popup));
});
popups.forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target === popup) closeModal(popup);
  });
});

loginBtn.addEventListener("click", () => {;
  openModal(authPopap);
});

regBtn.addEventListener("click", () => {;
  openModal(regPopap);
});
