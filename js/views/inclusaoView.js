import { formatCurrency, parseField } from "../utils/format.js";
import {
  calcularValoresInclusao,
  adicionarTransito,
} from "../models/estoque.js";

export function setupInclusao() {
  const form = document.querySelector("#inclusao-material form");
  const valorTotalEl = document.getElementById("inc-valor-total");
  const icmsEl = document.getElementById("inc-icms");
  const ipiEl = document.getElementById("inc-ipi");
  const pesoEl = document.getElementById("inc-peso-liquido");
  const outValor = document.getElementById("output-valor-liquido");
  const outPreco = document.getElementById("output-preco-medio");

  function atualizarOutputs() {
    const dados = {
      valorTotal: parseField(valorTotalEl),
      icms: parseField(icmsEl),
      ipi: parseField(ipiEl),
      pesoLiquido: parseField(pesoEl),
    };
    const { valorLiquido, precoMedio } = calcularValoresInclusao(dados);
    outValor.textContent = formatCurrency(valorLiquido);
    outPreco.textContent = formatCurrency(precoMedio);
    return { valorLiquido, precoMedio };
  }

  ["input", "change"].forEach((evt) => {
    valorTotalEl.addEventListener(evt, atualizarOutputs);
    icmsEl.addEventListener(evt, atualizarOutputs);
    ipiEl.addEventListener(evt, atualizarOutputs);
    pesoEl.addEventListener(evt, atualizarOutputs);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nf = document.getElementById("inc-nf").value.trim();
    const valorTotal = parseField(valorTotalEl);
    const icms = parseField(icmsEl);
    const ipi = parseField(ipiEl);
    const tipo = document.getElementById("inc-tipo-material").value;
    const espessura = parseField(document.getElementById("inc-espessura"));
    const pesoLiquido = parseField(pesoEl);
    const lote = document.getElementById("inc-lote").value.trim();
    const { valorLiquido, precoMedio } = atualizarOutputs();
    const entrada = {
      nf,
      valorTotal,
      icms,
      ipi,
      tipo,
      espessura,
      pesoLiquido,
      lote,
      valorLiquido,
      precoMedio,
      timestamp: Date.now(),
    };

    await fakeFetch("/api/inclusao", entrada);
    adicionarTransito(entrada);
    form.reset();
    atualizarOutputs();
    document.dispatchEvent(new CustomEvent("transito:updated"));
  });

  function fakeFetch(url, data) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ ok: true }), 300)
    );
  }

  atualizarOutputs();
}
