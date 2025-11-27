const LS_AUTH = "authUser";
const LS_USERS = "users";

const auth = { user: null };
let users = [];

export function loadAuth() {
  try {
    auth.user = JSON.parse(localStorage.getItem(LS_AUTH)) || null;
  } catch {
    auth.user = null;
  }
  try {
    users = JSON.parse(localStorage.getItem(LS_USERS)) || [];
  } catch {
    users = [];
  }
}
export function saveAuth() {
  if (auth.user) {
    localStorage.setItem(LS_AUTH, JSON.stringify(auth.user));
  } else {
    localStorage.removeItem(LS_AUTH);
  }
}
function saveUsers() {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}
export function login(user) {
  auth.user = user;
  saveAuth();
}
export function logout() {
  auth.user = null;
  saveAuth();
}
export function isLogged() {
  return !!auth.user;
}
export function registerUser({ email, senha, nome }) {
  const exists = users.find((u) => u.email === email);
  if (exists) {
    throw new Error("E-mail já cadastrado");
  }
  users.push({ email, senha, nome });
  saveUsers();
}
export function validateCredentials(email, senha) {
  const u = users.find((u) => u.email === email && u.senha === senha);
  return !!u;
}
export function getUserByEmail(email) {
  return users.find((u) => u.email === email) || null;
}
export default auth;
