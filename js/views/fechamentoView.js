import { gerarFechamento } from "../models/estoque.js";
import { formatCurrency } from "../utils/format.js";

export function setupFechamento() {
  const btnGerar = document.getElementById("btn-gerar-fechamento");
  const btnExportar = document.getElementById("btn-exportar-fechamento");
  const tbody = document.getElementById("fechamento-tbody");
  let ultimasLinhas = [];

  function render() {
    const linhas = gerarFechamento();
    ultimasLinhas = linhas;
    tbody.innerHTML = "";
    linhas.forEach((l) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${l.tipo}</td><td>${l.estoqueInicialPeso.toFixed(
        2
      )}</td><td>${formatCurrency(
        l.estoqueInicialValor
      )}</td><td>${l.totalEntradasPeso.toFixed(2)}</td><td>${formatCurrency(
        l.totalEntradasValor
      )}</td><td>${l.totalSaidasPeso.toFixed(2)}</td><td>${formatCurrency(
        l.totalSaidasValor
      )}</td><td>${l.estoqueFinalPeso.toFixed(2)}</td><td>${formatCurrency(
        l.estoqueFinalValor
      )}</td>`;
      tbody.appendChild(tr);
    });
  }

  function gerarCSV() {
    if (!ultimasLinhas.length) {
      render();
    }
    const sep = ",";
    const header = [
      "tipo",
      "estoqueInicialPeso",
      "estoqueInicialValor",
      "totalEntradasPeso",
      "totalEntradasValor",
      "totalSaidasPeso",
      "totalSaidasValor",
      "estoqueFinalPeso",
      "estoqueFinalValor",
    ];
    const linhasCSV = [header.join(sep)];
    ultimasLinhas.forEach((l) => {
      linhasCSV.push(
        [
          l.tipo,
          l.estoqueInicialPeso.toFixed(2),
          l.estoqueInicialValor.toFixed(2),
          l.totalEntradasPeso.toFixed(2),
          l.totalEntradasValor.toFixed(2),
          l.totalSaidasPeso.toFixed(2),
          l.totalSaidasValor.toFixed(2),
          l.estoqueFinalPeso.toFixed(2),
          l.estoqueFinalValor.toFixed(2),
        ].join(sep)
      );
    });
    const blob = new Blob([linhasCSV.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dataStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `fechamento_${dataStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  btnGerar.addEventListener("click", render);
  btnExportar.addEventListener("click", gerarCSV);
}
