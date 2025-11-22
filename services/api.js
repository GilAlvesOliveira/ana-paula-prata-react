import { getToken } from './storage';

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

// =============== AUTENTICAÇÃO ===============

// Cadastro com FormData (por causa do multer/upload no backend)
export async function registerUser(formData) {
  return apiRequest('/api/auth/register', 'POST', formData);
}

// Login com email/senha
export async function loginUser({ email, senha }) {
  return apiRequest('/api/auth/login', 'POST', { email, senha });
}

// Esqueci minha senha
export async function forgotPasswordApi(email) {
  return apiRequest('/auth/forgot-password', 'POST', { email });
}

// Redefinir senha
export async function resetPasswordApi({ email, token, novaSenha }) {
  return apiRequest('/auth/reset-password', 'POST', { email, token, novaSenha });
}

// =============== USUÁRIO ===============

// Buscar dados do usuário logado
export async function getUsuarioApi() {
  const token = getToken();
  if (!token) {
    throw { status: 401, message: 'Não autenticado' };
  }
  return apiRequest('/api/usuario/usuario', 'GET', null, token);
}

// Atualizar dados do usuário (nome, telefone, endereço, cep, avatar)
export async function updateUsuarioApi(formData) {
  const token = getToken();
  if (!token) {
    throw { status: 401, message: 'Não autenticado' };
  }
  return apiRequest('/api/usuario/usuario', 'PUT', formData, token);
}

// =============== PRODUTOS (ADMIN) ===============

// Listar produtos
export async function getProdutosApi({ q = '', somenteDisponiveis = false } = {}) {
  const params = new URLSearchParams();
  if (q) params.append('q', q);
  if (somenteDisponiveis) params.append('somenteDisponiveis', '1');

  const queryString = params.toString() ? `?${params.toString()}` : '';

  return apiRequest(`/api/products/produtos${queryString}`, 'GET');
}

// Criar produto (admin)
export async function createProdutoApi(formData) {
  const token = getToken();
  if (!token) {
    throw { status: 401, message: 'Não autenticado' };
  }
  return apiRequest('/api/products/produtos', 'POST', formData, token);
}

// Atualizar produto (admin)
export async function updateProdutoApi(id, formData) {
  const token = getToken();
  if (!token) {
    throw { status: 401, message: 'Não autenticado' };
  }
  return apiRequest(`/api/products/produtos?_id=${id}`, 'PUT', formData, token);
}

// Excluir produto (admin)
export async function deleteProdutoApi(id) {
  const token = getToken();
  if (!token) {
    throw { status: 401, message: 'Não autenticado' };
  }
  return apiRequest(`/api/products/produtos?_id=${id}`, 'DELETE', null, token);
}