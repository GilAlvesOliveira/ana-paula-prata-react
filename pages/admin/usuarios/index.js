// pages/admin/usuarios/index.js
import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import styles from '../../../styles/AdminUsuarios.module.css';
import { listarUsuariosAdminApi } from '../../../services/api';

const AdminUsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const [imagemAmpliada, setImagemAmpliada] = useState(null);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      setErro('');
      setInfoMsg('');

      const data = await listarUsuariosAdminApi();
      setUsuarios(data || []);

      if (!data || data.length === 0) {
        setInfoMsg('Nenhum usuário encontrado.');
      }
    } catch (e) {
      console.error('Erro ao listar usuários (admin):', e);
      if (e.status === 401) {
        setErro('Faça login como administrador para visualizar os usuários.');
      } else if (e.status === 403) {
        setErro('Acesso negado. Esta área é exclusiva para administradores.');
      } else {
        setErro(e.message || 'Erro ao carregar usuários.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const abrirImagem = (url) => {
    if (!url) return;
    setImagemAmpliada(url);
  };

  const fecharImagem = () => {
    setImagemAmpliada(null);
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>Usuários (Admin)</h1>
              <p className={styles.subtitle}>
                Visualize os usuários cadastrados e seus dados de contato.
              </p>
            </div>

            <button
              type="button"
              className={styles.refreshButton}
              onClick={carregarUsuarios}
              disabled={loading}
            >
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>

          {erro && <p className={styles.errorText}>{erro}</p>}
          {infoMsg && !erro && <p className={styles.infoText}>{infoMsg}</p>}

          {!loading && !erro && usuarios.length > 0 && (
            <section className={styles.usuariosList}>
              {usuarios.map((u) => (
                <div key={u._id} className={styles.usuarioCard}>
                  <div className={styles.usuarioHeader}>
                    <div className={styles.avatarWrapper}>
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.nome || 'Usuário'}
                          className={styles.avatarImg}
                          onClick={() => abrirImagem(u.avatar)}
                          style={{ cursor: 'pointer' }}
                        />
                      ) : (
                        <div className={styles.avatarPlaceholder}>Sem foto</div>
                      )}
                    </div>

                    <div className={styles.usuarioInfo}>
                      <span className={styles.usuarioNome}>
                        {u.nome || 'Usuário sem nome'}
                      </span>

                      {u.email && (
                        <span className={styles.usuarioCampo}>
                          E-mail: {u.email}
                        </span>
                      )}

                      {u.telefone && (
                        <span className={styles.usuarioCampo}>
                          Telefone: {u.telefone}
                        </span>
                      )}

                      {u.endereco && (
                        <span className={styles.usuarioCampo}>
                          Endereço: {u.endereco}
                        </span>
                      )}

                      {u.cep && (
                        <span className={styles.usuarioCampo}>
                          CEP: {u.cep}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </main>

      <Footer />

      {/* Modal para ampliar a foto do usuário */}
      {imagemAmpliada && (
        <div className={styles.modalOverlay} onClick={fecharImagem}>
          <div
            className={styles.modalImgBox}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalImgClose}
              onClick={fecharImagem}
            >
              ✕
            </button>

            <img
              src={imagemAmpliada}
              alt="Imagem ampliada"
              className={styles.modalImg}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsuariosPage;