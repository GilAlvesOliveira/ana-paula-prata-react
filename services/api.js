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

// =======================
// AUTENTICAÇÃO / USUÁRIO
// =======================

// Cadastro com FormData (por causa do multer/upload no backend)
export async function registerUser(formData) {
  return apiRequest('/api/auth/register', 'POST', formData);
}

// Login com email/senha
export async function loginUser({ email, senha }) {
  return apiRequest('/api/auth/login', 'POST', { email, senha });
}

// Esqueci minha senha
export async function forgotPassword(email) {
  return apiRequest('/api/auth/forgot-password', 'POST', { email });
}

// Redefinir senha
export async function resetPassword({ email, token, novaSenha }) {
  return apiRequest('/api/auth/reset-password', 'POST', {
    email,
    token,
    novaSenha,
  });
}

// Buscar dados do usuário logado (perfil)
export async function getUsuarioApi(token) {
  return apiRequest('/api/usuario/usuario', 'GET', null, token);
}

// Atualizar dados do usuário (perfil + avatar)
export async function updateUsuarioApi(formData, token) {
  return apiRequest('/api/usuario/usuario', 'PUT', formData, token);
}

// =======================
// PRODUTOS
// =======================

// Listar produtos (admin ou público)
// params: { q?: string, somenteDisponiveis?: boolean }
export async function getProdutos(params = {}) {
  const query = new URLSearchParams();

  if (params.q) {
    query.append('q', params.q);
  }
  if (params.somenteDisponiveis) {
    query.append('somenteDisponiveis', '1');
  }

  const queryString = query.toString();
  const endpoint = `/api/products/produtos${queryString ? `?${queryString}` : ''}`;

  return apiRequest(endpoint, 'GET');
}

// Criar novo produto (admin) - com imagem (FormData)
export async function createProduto(formData, token) {
  return apiRequest('/api/products/produtos', 'POST', formData, token);
}

// Atualizar produto (admin) - com/sem imagem (FormData)
export async function updateProduto(id, formData, token) {
  return apiRequest(`/api/products/produtos?_id=${id}`, 'PUT', formData, token);
}

// Excluir produto (admin)
export async function deleteProduto(id, token) {
  return apiRequest(`/api/products/produtos?_id=${id}`, 'DELETE', null, token);
}