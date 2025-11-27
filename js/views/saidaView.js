import { registrarSaida } from "../models/estoque.js";
import { formatCurrency, parseField } from "../utils/format.js";

export function setupSaida() {
  const form = document.querySelector("#saida-material form");
  const tipoEl = document.getElementById("saida-tipo-material");
  const pesoEl = document.getElementById("saida-peso");
  const out = document.getElementById("output-custo-saida");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const tipo = tipoEl.value;
    const peso = parseField(pesoEl);
    try {
      const { valorSaida } = registrarSaida(tipo, peso);
      out.textContent = formatCurrency(valorSaida);
      form.reset();
      document.dispatchEvent(new CustomEvent("estoque:updated"));
    } catch (err) {
      alert(err.message);
    }
  });
}
