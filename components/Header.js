import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
      <img 
        src="/imagens/LogoLojaPP.png" 
        alt="Logo Ana Paula Prata Joias & Modas" 
        className={styles.logo} 
      />
    </header>
  )
}

export default Header
