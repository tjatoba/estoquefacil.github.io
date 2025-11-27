import state from "../models/state.js";
import { formatCurrency } from "../utils/format.js";

export function setupResumo() {
  const container = document.getElementById("resumo-estoque");
  function render() {
    container.innerHTML = "";
    const tipos = Object.keys(state.estoquePrincipal);
    if (!tipos.length) {
      container.innerHTML =
        '<div class="resumo-item">Sem dados de estoque principal.</div>';
      return;
    }
    tipos.forEach((tipo) => {
      const r = state.estoquePrincipal[tipo];
      const precoMedio =
        r.pesoTotal > 0 ? r.valorTotalLiquido / r.pesoTotal : 0;
      const div = document.createElement("div");
      div.className = "resumo-item";
      div.innerHTML = `<span>${tipo}</span><span>Peso: ${r.pesoTotal.toFixed(
        2
      )} kg</span><span>Valor: ${formatCurrency(
        r.valorTotalLiquido
      )}</span><span>PMP: ${formatCurrency(precoMedio)}</span>`;
      container.appendChild(div);
    });
  }
  document.addEventListener("estoque:updated", render);
  render();
}
