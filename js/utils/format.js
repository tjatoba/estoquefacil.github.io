export function formatCurrency(v) {
  if (isNaN(v) || v === null) return "R$ 0,00";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
export function parseField(el) {
  if (!el) return 0;
  const val = parseFloat(String(el.value).replace(",", "."));
  return isNaN(val) ? 0 : val;
}
