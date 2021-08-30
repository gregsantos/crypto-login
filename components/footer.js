import styles from './footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr />
      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <a
            href='https://github.com/onflow/fcl-js/blob/master/docs/user-signature.mdx'
            target='_blank'
            rel='noreferrer'
          >
            Docs
          </a>
        </li>
      </ul>
    </footer>
  )
}
