const STORAGE_TOKEN = 'APP_TOKEN';
const STORAGE_USER = 'APP_USER';

// Salvar token
export function saveToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_TOKEN, token);
}

// Ler token
export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_TOKEN);
}

// Remover token
export function removeToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_TOKEN);
}

// Salvar dados do usuário
export function saveUser(user) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
}

// Ler usuário
export function getUser() {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_USER);
  return data ? JSON.parse(data) : null;
}

// Limpar tudo (logout)
export function signOut() {
  removeToken();
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_USER);
}