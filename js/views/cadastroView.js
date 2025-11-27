import { registerUser } from "../models/auth.js";
export function setupCadastro() {
  const form = document.getElementById("form-cadastro");
  const btnFinalizar = document.getElementById("btn-finalizar-cadastro");
  const nomeResp = document.getElementById("cad-nome-resp");
  const nomeEmp = document.getElementById("cad-nome-empresa");
  const cnpj = document.getElementById("cad-cnpj");
  const email = document.getElementById("cad-email");
  const emailConf = document.getElementById("cad-email-conf");
  const senha = document.getElementById("cad-senha");
  const senhaConf = document.getElementById("cad-senha-conf");
  const loginEmail = document.getElementById("login-email");
  const loginSenha = document.getElementById("login-senha");

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  function isValidCNPJ(v) {
    const digits = String(v).replace(/\D/g, "");
    return digits.length === 14;
  }
  function updateButton() {
    const ok =
      nomeResp.value.trim() &&
      nomeEmp.value.trim() &&
      isValidCNPJ(cnpj.value) &&
      isValidEmail(email.value) &&
      email.value.trim() === emailConf.value.trim() &&
      senha.value.length >= 6 &&
      senha.value === senhaConf.value;
    btnFinalizar.disabled = !ok;
  }

  [nomeResp, nomeEmp, cnpj, email, emailConf, senha, senhaConf].forEach(
    (el) => {
      el.addEventListener("input", updateButton);
      el.addEventListener("change", updateButton);
    }
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateButton();
    if (btnFinalizar.disabled) {
      alert(
        "Verifique os campos: CNPJ (14 dígitos), e-mails iguais e válidos, senha com 6+ caracteres."
      );
      return;
    }
    try {
      registerUser({
        email: email.value.trim(),
        senha: senha.value,
        nome: nomeResp.value.trim(),
      });
    } catch (err) {
      alert(err.message);
      form.reset();
      updateButton();
      if (email) email.focus();
      return;
    }
    window.location.hash = "#tela-login";
    if (loginEmail && loginSenha) {
      loginEmail.value = email.value.trim();
      loginSenha.value = senha.value;
    }
    form.reset();
    updateButton();
  });

  updateButton();
}
