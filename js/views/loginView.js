import {
  login,
  loadAuth,
  validateCredentials,
  getUserByEmail,
} from "../models/auth.js";

export function setupLogin() {
  loadAuth();
  const form = document.querySelector("#tela-login form");
  const emailEl = document.getElementById("login-email");
  const senhaEl = document.getElementById("login-senha");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailEl.value.trim();
    const senha = senhaEl.value.trim();
    if (!email || !senha) {
      alert("Informe e-mail e senha.");
      return;
    }
    if (!validateCredentials(email, senha)) {
      alert("Credenciais inválidas. Verifique e-mail e senha ou cadastre-se.");
      return;
    }
    const u = getUserByEmail(email);
    login({ email: u.email, nome: u.nome });
    document.dispatchEvent(new CustomEvent("auth:login"));
    window.location.hash = "#inclusao-material";
  });
}
