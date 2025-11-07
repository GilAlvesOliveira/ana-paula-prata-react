import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.social}>
        <a
          href="https://www.instagram.com/anapaula_pratajoias?igsh=YTVmYjE5cXF4Z2Q2"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          <img
            src="/imagens/instagramLogo.jpg"
            alt="Instagram Logo"
            className={styles.icon}
          />
          <span>Instagram</span>
        </a>
      </div>

      <div className={styles.contact}>
        <div className={styles.whatsapp}>
          <a
            href="https://wa.me/5515998228365"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactLink}
          >
            <img
              src="/imagens/whatsappLogo.png"
              alt="WhatsApp Logo"
              className={styles.icon}
            />
            <span>WhatsApp (15) 99822-8365</span>
          </a>
          <a
            href="https://wa.me/5515997291902"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactLink}
          >
            <img
              src="/imagens/whatsappLogo.png"
              alt="WhatsApp Logo"
              className={styles.icon}
            />
            <span>WhatsApp (15) 99729-1902</span>
          </a>
        </div>
      </div>

      <div className={styles.location}>
        <p>📍 R. Sete de Setembro, 38 - Centro, Araçoiaba da Serra - SP, 18190-000</p>
      </div>

      <div className={styles.hours}>
        <p>📅 Seg á Sex: 9:00h às 18:00h</p>
        <p>Sab: 9:00h às 15:00h</p>
      </div>

      <div className={styles.copy}>
        <p>© 2025 Ana Paula Prata Joias & Modas</p>
      </div>
    </footer>
  )
}

export default Footer
