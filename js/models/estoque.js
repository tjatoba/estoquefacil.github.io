import state, { saveState } from "./state.js";

export function adicionarTransito(entrada) {
  state.materiaisEmTransito.push(entrada);
  state.historicoEntradas.push({
    tipo: entrada.tipo,
    peso: entrada.pesoLiquido,
    valor: entrada.valorLiquido,
    timestamp: Date.now(),
  });
  saveState();
}

export function darBaixa(index) {
  const mat = state.materiaisEmTransito[index];
  if (!mat) return null;
  if (!state.estoquePrincipal[mat.tipo]) {
    state.estoquePrincipal[mat.tipo] = { pesoTotal: 0, valorTotalLiquido: 0 };
  }
  const reg = state.estoquePrincipal[mat.tipo];
  reg.pesoTotal += mat.pesoLiquido; // (95)
  reg.valorTotalLiquido += mat.valorLiquido; // (96)
  state.materiaisEmTransito.splice(index, 1);
  saveState();
  return reg;
}

export function registrarSaida(tipo, peso) {
  const reg = state.estoquePrincipal[tipo];
  if (!reg || reg.pesoTotal <= 0) throw new Error("Sem estoque para o tipo");
  if (peso <= 0) throw new Error("Peso inválido");
  if (peso > reg.pesoTotal)
    throw new Error("Peso maior que o estoque disponível");
  const precoMedioAtual =
    reg.pesoTotal > 0 ? reg.valorTotalLiquido / reg.pesoTotal : 0;
  const valorSaida = precoMedioAtual * peso;
  reg.pesoTotal -= peso;
  reg.valorTotalLiquido -= valorSaida;
  state.historicoSaidas.push({
    tipo,
    peso,
    valor: valorSaida,
    timestamp: Date.now(),
  });
  saveState();
  return { valorSaida, precoMedioAtual };
}

export function gerarFechamento() {
  const tipos = new Set([
    ...state.historicoEntradas.map((e) => e.tipo),
    ...state.historicoSaidas.map((s) => s.tipo),
    ...Object.keys(state.estoquePrincipal),
  ]);
  const linhas = [];
  tipos.forEach((tipo) => {
    const reg = state.estoquePrincipal[tipo] || {
      pesoTotal: 0,
      valorTotalLiquido: 0,
    };
    const entradas = state.historicoEntradas.filter((e) => e.tipo === tipo);
    const saidas = state.historicoSaidas.filter((s) => s.tipo === tipo);
    const totalEntradasPeso = entradas.reduce((a, b) => a + b.peso, 0);
    const totalEntradasValor = entradas.reduce((a, b) => a + b.valor, 0);
    const totalSaidasPeso = saidas.reduce((a, b) => a + b.peso, 0);
    const totalSaidasValor = saidas.reduce((a, b) => a + b.valor, 0);
    const estoqueFinalPeso = reg.pesoTotal;
    const estoqueFinalValor = reg.valorTotalLiquido;
    const estoqueInicialPeso =
      estoqueFinalPeso + totalSaidasPeso - totalEntradasPeso;
    const estoqueInicialValor =
      estoqueFinalValor + totalSaidasValor - totalEntradasValor;
    linhas.push({
      tipo,
      estoqueInicialPeso,
      estoqueInicialValor,
      totalEntradasPeso,
      totalEntradasValor,
      totalSaidasPeso,
      totalSaidasValor,
      estoqueFinalPeso,
      estoqueFinalValor,
    });
  });
  return linhas;
}

export function calcularValoresInclusao({
  valorTotal,
  icms,
  ipi,
  pesoLiquido,
}) {
  const valorLiquido = valorTotal - icms - ipi;
  const precoMedio = pesoLiquido > 0 ? valorLiquido / pesoLiquido : 0; // (97)
  return { valorLiquido, precoMedio };
}
