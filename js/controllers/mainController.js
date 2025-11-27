import { loadState } from "../models/state.js";
import { setupInclusao } from "../views/inclusaoView.js";
import { setupTransito } from "../views/transitoView.js";
import { setupResumo } from "../views/resumoView.js";
import { setupSaida } from "../views/saidaView.js";
import { setupFechamento } from "../views/fechamentoView.js";
import { setupCadastro } from "../views/cadastroView.js";
import { setupLogin } from "../views/loginView.js";
import auth, { isLogged, loadAuth, logout } from "../models/auth.js";

export function initApp() {
  loadState();
  loadAuth();
  setupLogin();
  setupInclusao();
  setupTransito();
  setupResumo();
  setupSaida();
  setupFechamento();
  setupCadastro();

  const navStatus = document.getElementById("nav-status");
  const linkSair = document.getElementById("link-sair");
  const navInclusao = document.getElementById("nav-inclusao");
  const navTerceiros = document.getElementById("nav-terceiros");
  const navSaida = document.getElementById("nav-saida");
  const navFechamento = document.getElementById("nav-fechamento");

  function aplicarVisibilidadePorAuth() {
    const logged = isLogged();

    const appSections = [
      "#inclusao-material",
      "#gestao-terceiros",
      "#saida-material",
      "#fechamento-mensal",
    ];
    const authSections = ["#tela-login", "#tela-cadastro"];
    appSections.forEach((h) => {
      const el = document.querySelector(h);
      if (el) el.classList.toggle("hidden", !logged);
    });
    authSections.forEach((h) => {
      const el = document.querySelector(h);
      if (el) el.classList.toggle("hidden", logged);
    });

    if (navStatus) {
      navStatus.style.display = logged ? "inline-block" : "none";
      if (logged && auth.user) {
        const nomeOuEmail = auth.user.nome || auth.user.email || "";
        navStatus.textContent = `Logado: ${nomeOuEmail}`;
      } else {
        navStatus.textContent = "Logado";
      }
    }
    if (linkSair) linkSair.style.display = logged ? "inline" : "none";
    if (navInclusao) navInclusao.style.display = logged ? "inline" : "none";
    if (navTerceiros) navTerceiros.style.display = logged ? "inline" : "none";
    if (navSaida) navSaida.style.display = logged ? "inline" : "none";
    if (navFechamento) navFechamento.style.display = logged ? "inline" : "none";
    if (!logged) {
      window.location.hash = "#tela-login";
    } else {
      if (
        ![
          "#inclusao-material",
          "#gestao-terceiros",
          "#saida-material",
          "#fechamento-mensal",
        ].includes(window.location.hash)
      ) {
        window.location.hash = "#inclusao-material";
      }
    }
  }

  aplicarVisibilidadePorAuth();
  document.addEventListener("auth:login", aplicarVisibilidadePorAuth);
  document.addEventListener("auth:logout", aplicarVisibilidadePorAuth);
  if (linkSair) {
    linkSair.addEventListener("click", (e) => {
      logout();
      document.dispatchEvent(new CustomEvent("auth:logout"));
      aplicarVisibilidadePorAuth();
    });
  }
}
