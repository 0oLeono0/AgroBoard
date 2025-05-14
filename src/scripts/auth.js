/**
 * Manages authentication-related functionality: login and registration.
 */
import { openModal, closeModal } from "./modal.js";
import { registerUser } from "./api.js";
import { addPopupOpenListener } from "./popup.js";

export const initAuth = () => {
  const loginBtn = document.querySelector(".header__login");
  const regBtn = document.querySelector(".header__reg");
  const authPopup = document.querySelector(".popup_type_auth");
  const regPopup = document.querySelector(".popup_type_reg");

  // Open login and registration popups
  addPopupOpenListener(loginBtn, authPopup);
  addPopupOpenListener(regBtn, regPopup);

  // Handle registration form submission
  const regFormElement = document.forms["reg"];
  regFormElement.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(regFormElement);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone"),
      inn: formData.get("inn"),
      role: formData.get("role"),
    };

    if (!data.role) {
      alert("Пожалуйста, выберите роль: Покупатель или Фермер");
      return;
    }
    closeModal(regPopup);
    // Перенаправление в зависимости от роли
    window.location.href =
      data.role === "buyer" ? "./buyer.html" : "./profile.html";
  });
};
