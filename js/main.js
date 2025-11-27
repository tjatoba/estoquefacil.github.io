import { initApp } from "./controllers/mainController.js";
import { isLogged } from "./models/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  initApp();
  setupSectionRouting();
});

function setupSectionRouting() {
  const sections = Array.from(document.querySelectorAll("main > section"));
  function showOnly(hash) {
    const logged = isLogged();
    const defaultHash = logged ? "#inclusao-material" : "#tela-login";
    const target = document.querySelector(hash || defaultHash);
    if (!target) return;
    const authIds = new Set(["tela-login", "tela-cadastro"]);
    const isAuthTarget = authIds.has(target.id);
    if (logged || isAuthTarget) {
      sections.forEach((sec) => {
        if (sec === target) {
          sec.classList.remove("hidden");
        }
      });
    } else {
      window.location.hash = "#tela-login";
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }
  showOnly(window.location.hash);
  window.addEventListener("hashchange", () => showOnly(window.location.hash));
}
