// pages/reset-password.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';
import { resetPassword } from '../services/api';

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  // Pega token + email da URL
  useEffect(() => {
    if (!router.isReady) return;

    const { token, email } = router.query;
    if (typeof token === 'string') setToken(token);
    if (typeof email === 'string') setEmail(decodeURIComponent(email));
  }, [router.isReady, router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    if (!novaSenha || !confirmarSenha) {
      setErro('Preencha todos os campos.');
      return;
    }

    if (novaSenha.length < 4) {
      setErro('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não conferem.');
      return;
    }

    if (!email || !token) {
      setErro('Link inválido ou incompleto.');
      return;
    }

    try {
      setLoading(true);

      const resp = await resetPassword({
        email,
        token,
        novaSenha,
      });

      setMensagem(resp.msg || 'Senha redefinida com sucesso!');
      // Opcional: redirecionar pro login depois de alguns segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (e) {
      console.error(e);
      setErro(e.message || 'Erro ao redefinir senha.');
    } finally {
      setLoading(false);
    }
  };

  const voltarLogin = () => {
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Redefinir senha</h1>

        <p className={styles.subtitle}>
          Escolha uma nova senha para sua conta.
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nova senha</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Digite a nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirmar nova senha</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Repita a nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>

          {erro && <p className={styles.errorText}>{erro}</p>}

          {mensagem && (
            <p
              style={{
                color: '#8fff8a',
                fontSize: '14px',
                marginTop: '4px',
                marginBottom: '6px',
              }}
            >
              {mensagem}
            </p>
          )}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Redefinir senha'}
          </button>
        </form>

        <button
          type="button"
          className={styles.registerButton}
          onClick={voltarLogin}
        >
          Voltar ao login
        </button>
      </div>
    </div>
  );
}