// pages/register.js
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Register.module.css';
import { registerUser, loginUser } from '../services/api';
import { saveToken, saveUser } from '../services/storage';

export default function Register() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // 👇 novo estado para imagem
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const senhaInvalida = senha && senha.length < 4;
  const senhasDiferentes =
    senha && confirmarSenha && senha !== confirmarSenha;

  const isFormValid = useMemo(() => {
    if (!nome || !email || !senha || !confirmarSenha) return false;
    if (senha.length < 4) return false;
    if (senha !== confirmarSenha) return false;
    // imagem não é obrigatória
    return true;
  }, [nome, email, senha, confirmarSenha]);

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }

    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!isFormValid) {
      setErro('Preencha todos os campos corretamente.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('email', email);
      formData.append('senha', senha);

      // 👇 se tiver imagem, manda como "file" (multer espera esse nome)
      if (avatarFile) {
        formData.append('file', avatarFile);
      }

      // 1) Cadastra usuário
      await registerUser(formData);

      // 2) Faz login automático
      const loginResponse = await loginUser({ email, senha });

      const token = loginResponse.token;
      const usuario = loginResponse.usuario || loginResponse.user;

      if (token) {
        saveToken(token);
      }

      if (usuario) {
        saveUser(usuario);
      }

      setSucesso('Conta criada com sucesso! Redirecionando...');
      router.push('/');
    } catch (error) {
      console.error(error);
      setErro(error.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Criar conta</h1>

        <p className={styles.subtitle}>
          Preencha os dados para criar sua conta
        </p>

        {/* 👇 bloco de upload de imagem */}
        <div className={styles.imageUploadContainer}>
          <label className={styles.imageLabel}>Foto de perfil (opcional)</label>
          <div className={styles.imageRow}>
            <label className={styles.imageInputButton}>
              Escolher imagem
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>

            {avatarPreview && (
              <div className={styles.imagePreviewWrapper}>
                <img
                  src={avatarPreview}
                  alt="Pré-visualização do avatar"
                  className={styles.imagePreview}
                />
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nome completo</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

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
              placeholder="Crie uma senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            {senhaInvalida && (
              <span className={styles.helperText}>
                A senha deve ter pelo menos 4 caracteres.
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirmar senha</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Repita a senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
            {senhasDiferentes && (
              <span className={styles.helperText}>
                As senhas não conferem.
              </span>
            )}
          </div>

          {erro && (
            <p className={styles.errorText}>
              {erro}
            </p>
          )}

          {sucesso && (
            <p className={styles.successText}>
              {sucesso}
            </p>
          )}

          <button
            type="submit"
            className={styles.registerButton}
            disabled={loading || !isFormValid}
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <button
          type="button"
          className={styles.backToLoginButton}
          onClick={handleGoToLogin}
        >
          Já tenho uma conta
        </button>
      </div>
    </div>
  );
}