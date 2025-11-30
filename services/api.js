import { getToken } from './storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const MELHOR_ENVIO_BASE_URL =
  (process.env.NEXT_PUBLIC_URL_MELHOR_ENVIO || 'https://www.melhorenvio.com.br/api/v2').replace(/\/$/, '');

async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
  const headers = {};

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

function dispararEventoCarrinho(totalItens) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('carrinhoAtualizado', {
        detail: { totalItens },
      })
    );
  }
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

// =============== USUÁRIOS (ADMIN) ===============

export async function listarUsuariosAdminApi() {
  const token = getToken();
  if (!token) {
    throw { status: 401, message: 'Não autenticado' };
  }

  // rota: src/pages/api/admin/usuarios/usuarios.ts
  return apiRequest('/api/admin/usuarios', 'GET', null, token);
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

// =============== PRODUTOS - BUSCA POR CATEGORIA / TERMO ===============

// Usa a rota /api/products/busca que você já tem no backend
export async function buscarProdutosApi({ q }) {
  const params = new URLSearchParams();
  if (q) params.append('q', q);

  const queryString = params.toString() ? `?${params.toString()}` : '';

  return apiRequest(`/api/products/busca${queryString}`, 'GET');
}

// =============== CARRINHO ===============

export async function getCarrinhoApi() {
  const token = getToken();
  if (!token) {
    throw { status: 401, message: 'Não autenticado' };
  }

  const data = await apiRequest('/api/carrinho/carrinho', 'GET', null, token);
  return data;
}

export async function addItemCarrinhoApi({ produtoId, quantidade }) {
  const token = getToken();
  if (!token) {
    throw { status: 401, message: 'Não autenticado' };
  }

  const resp = await apiRequest(
    '/api/carrinho/carrinho',
    'POST',
    { produtoId, quantidade },
    token
  );

  dispararEventoCarrinho();

  return resp;
}

export async function removerItemCarrinhoApi(produtoId) {
  const token = getToken();
  if (!token) {
    throw { status: 401, message: 'Não autenticado' };
  }

  const resp = await apiRequest(
    '/api/carrinho/item',
    'DELETE',
    { produtoId },
    token
  );

  dispararEventoCarrinho();

  return resp;
}

// 👉 AGORA usando a rota nova /api/pedidos/pedidos
export async function criarPedidoApi({ frete }) {
  const token = getToken();
  if (!token) {
    throw { status: 401, message: 'Não autenticado' };
  }

  const resp = await apiRequest(
    '/api/pedidos/pedidos',
    'POST',
    { frete },
    token
  );

  dispararEventoCarrinho(0);

  return resp;
}

// =============== FRETE - MELHOR ENVIO ===============

export async function calcularFreteMelhorEnvio({
  from,
  to,
  width,
  height,
  length,
  weight,
  insuranceValue = 0,
}) {
  const params = new URLSearchParams({
    from,
    to,
    width: String(width),
    height: String(height),
    length: String(length),
    weight: String(weight),
    insurance_value: String(insuranceValue),
  });

  const url = `${MELHOR_ENVIO_BASE_URL}/calculator?${params.toString()}`;

  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.error || 'Erro ao calcular frete',
    };
  }

  // A API retorna um array de opções
  return data;
}

// =============== MERCADO PAGO ===============

export async function criarPreferenciaPagamentoApi({ total, pedidoId }) {
  const token = getToken();
  if (!token) {
    throw { status: 401, message: 'Não autenticado' };
  }

  return apiRequest(
    '/api/mercado_pago/preference',
    'POST',
    { total, pedidoId },
    token
  );
}

// =============== PEDIDOS ===============

export async function listarPedidosApi() {
  const token = getToken();
  if (!token) {
    throw { status: 401, message: 'Não autenticado' };
  }

  return apiRequest('/api/pedidos/pedidos', 'GET', null, token);
}

export async function gerarPreferenciaPagamentoApi({ pedidoId, total }) {
  const token = getToken();
  if (!token) {
    throw { status: 401, message: 'Não autenticicado' };
  }

  return apiRequest(
    '/api/mercado_pago/preference',
    'POST',
    { pedidoId, total },
    token
  );
}

export async function atualizarEnvioPedidoApi({ pedidoId, enviado }) {
  const token = getToken();
  if (!token) {
    throw { status: 401, message: 'Não autenticado' };
  }

  return apiRequest(
    `/api/pedidos/pedidos?_id=${pedidoId}`,
    'PUT',
    { enviado },
    token
  );
}