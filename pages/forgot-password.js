import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';
import { forgotPassword } from '../services/api';

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    if (!email) {
      setErro('Digite seu email.');
      return;
    }

    try {
      setLoading(true);
      const resp = await forgotPassword(email);

      setMensagem(
        resp.msg ||
          'Se este email estiver cadastrado, enviaremos um link para redefinir sua senha.'
      );
    } catch (e) {
      setErro(e.message || 'Erro ao solicitar recuperação.');
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
        <h1 className={styles.title}>Recuperar senha</h1>

        <p className={styles.subtitle}>
          Informe seu email para enviar o link de redefinição.
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

          {erro && <p className={styles.errorText}>{erro}</p>}

          {mensagem && (
            <p style={{ color: '#8fff8a', fontSize: '14px', marginBottom: '6px' }}>
              {mensagem}
            </p>
          )}

          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar link'}
          </button>
        </form>

        <button className={styles.registerButton} onClick={voltarLogin}>
          Voltar ao login
        </button>
      </div>
    </div>
  );
}
