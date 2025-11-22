// services/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
  const headers = {};

  // Só coloca Content-Type JSON se NÃO for FormData
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : null,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.erro || data.msg || 'Erro na requisição',
    };
  }

  return data;
}

// Cadastro com FormData (por causa do multer/upload no backend)
export async function registerUser(formData) {
  return apiRequest('/api/auth/register', 'POST', formData);
}

// Login com email/senha
export async function loginUser({ email, senha }) {
  return apiRequest('/api/auth/login', 'POST', { email, senha });
}

// Recuperação de senha (envia email)
export async function forgotPassword(email) {
  return apiRequest('/api/auth/forgot-password', 'POST', { email });
}

// Redefinir senha (usa token + email + novaSenha)
export async function resetPassword({ email, token, novaSenha }) {
  return apiRequest('/api/auth/reset-password', 'POST', {
    email,
    token,
    novaSenha,
  });
}

// 🔹 Buscar dados completos do usuário logado (GET /api/usuario/usuario)
export async function getUsuarioApi(token) {
  return apiRequest('/api/usuario/usuario', 'GET', null, token);
}

// 🔹 Atualizar dados do usuário (PUT /api/usuario/usuario, com FormData)
export async function updateUsuarioApi(formData, token) {
  return apiRequest('/api/usuario/usuario', 'PUT', formData, token);
}