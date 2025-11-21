import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';
import { loginUser } from '../services/api';
import { saveToken, saveUser } from '../services/storage';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Preencha email e senha.');
      return;
    }

    try {
      setLoading(true);

      const resp = await loginUser({ email, senha });

      const token = resp.token;
      const usuario = resp.usuario || resp.user;

      if (token) {
        saveToken(token);
      }

      if (usuario) {
        saveUser(usuario);
      }

      router.push('/');
    } catch (error) {
      console.error(error);
      setErro(error.message || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToRegister = () => {
    router.push('/register');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        <h1 className={styles.title}>Entrar</h1>

        <p className={styles.subtitle}>
          Faça login para acessar sua conta
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Senha</label>
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {erro && (
            <p
              style={{
                color: '#ff8a8a',
                fontSize: '13px',
                marginTop: '4px',
                marginBottom: '6px',
              }}
            >
              {erro}
            </p>
          )}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <button type="button" className={styles.forgotButton}>
          Esqueci minha senha
        </button>

        <button
          type="button"
          className={styles.registerButton}
          onClick={handleGoToRegister}
        >
          Criar uma conta
        </button>

      </div>
    </div>
  );
}