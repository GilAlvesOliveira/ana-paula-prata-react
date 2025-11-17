import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/seuinstagram" // Troque pelo correto
        target="_blank"
        rel="noopener noreferrer"
        className={styles.row}
      >
        <img
          src="/imagens/instagramLogo.jpg"
          alt="Instagram"
          className={styles.icon}
        />
        <span className={styles.label}>Instagram</span>
      </a>

      {/* WhatsApp */}
      <div className={styles.row}>
        <img
          src="/imagens/whatsappLogo.png"
          alt="WhatsApp"
          className={styles.icon}
        />

        <div className={styles.whatsappNumbers}>
          <a
            href="https://wa.me/5515998228365"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappLink}
          >
            15 99822-8365
          </a>
          <a
            href="https://wa.me/5515997291902"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappLink}
          >
            15 99729-1902
          </a>
        </div>
      </div>

      {/* Endereço */}
      <div className={styles.address}>
        <span className={styles.pin}>📍</span>
        R. Sete de Setembro, 38 - Centro, Araçoiaba da Serra - SP, 18190-000
      </div>

    </footer>
  );
};

export default Footer;
