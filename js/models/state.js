const LS_KEYS = {
  transito: "materiaisEmTransito",
  estoque: "estoquePrincipal",
  entradas: "historicoEntradas",
  saidas: "historicoSaidas",
};

const state = {
  materiaisEmTransito: [],
  estoquePrincipal: {}, // { tipo: { pesoTotal, valorTotalLiquido } }
  historicoEntradas: [], // {tipo,peso,valor,timestamp}
  historicoSaidas: [], // {tipo,peso,valor,timestamp}
};

export function loadState() {
  try {
    state.materiaisEmTransito =
      JSON.parse(localStorage.getItem(LS_KEYS.transito)) || [];
    state.estoquePrincipal =
      JSON.parse(localStorage.getItem(LS_KEYS.estoque)) || {};
    state.historicoEntradas =
      JSON.parse(localStorage.getItem(LS_KEYS.entradas)) || [];
    state.historicoSaidas =
      JSON.parse(localStorage.getItem(LS_KEYS.saidas)) || [];
  } catch (e) {
    console.warn("Falha ao carregar estado", e);
  }
}

export function saveState() {
  localStorage.setItem(
    LS_KEYS.transito,
    JSON.stringify(state.materiaisEmTransito)
  );
  localStorage.setItem(LS_KEYS.estoque, JSON.stringify(state.estoquePrincipal));
  localStorage.setItem(
    LS_KEYS.entradas,
    JSON.stringify(state.historicoEntradas)
  );
  localStorage.setItem(LS_KEYS.saidas, JSON.stringify(state.historicoSaidas));
}

export default state;
