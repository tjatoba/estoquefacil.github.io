import state from "../models/state.js";
import { darBaixa } from "../models/estoque.js";
import { formatCurrency } from "../utils/format.js";

export function setupTransito() {
  const tbody = document.getElementById("transito-tbody");

  function render() {
    tbody.innerHTML = "";
    if (!state.materiaisEmTransito.length) {
      tbody.innerHTML =
        '<tr><td colspan="5">Sem materiais em trânsito.</td></tr>';
      return;
    }
    state.materiaisEmTransito.forEach((mat, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${mat.nf || "-"}</td><td>${
        mat.tipo
      }</td><td>${mat.pesoLiquido.toFixed(2)}</td><td>${formatCurrency(
        mat.valorLiquido
      )}</td><td><button data-idx="${idx}" class="btn-baixa">Dar baixa</button></td>`;
      tbody.appendChild(tr);
    });
  }

  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-baixa");
    if (!btn) return;
    const idx = parseInt(btn.getAttribute("data-idx"), 10);
    darBaixa(idx);
    render();
    document.dispatchEvent(new CustomEvent("estoque:updated"));
  });

  document.addEventListener("transito:updated", render);
  render();
}
