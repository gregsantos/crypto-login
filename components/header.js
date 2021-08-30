import Link from 'next/link'
import { signOut, useSession } from 'next-auth/client'
import { authenticate } from '../pages/index'
import styles from './header.module.css'

export default function Header() {
  const [session, loading] = useSession()

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          {!session && (
            <>
              <span className={styles.notSignedInText}>
                You are not signed in
              </span>
              <a
                href={`/protected`}
                className={styles.buttonPrimary}
                onClick={e => {
                  e.preventDefault()
                  authenticate()
                }}
              >
                Sign in
              </a>
            </>
          )}
          {session && (
            <>
              {session.user.image && (
                <span
                  style={{ backgroundImage: `url(${session.user.image})` }}
                  className={styles.avatar}
                />
              )}
              <span className={styles.signedInText}>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.id}</strong>
              </span>
              <a
                href={`/`}
                className={styles.button}
                onClick={e => {
                  e.preventDefault()
                  signOut()
                }}
              >
                Sign out
              </a>
            </>
          )}
        </p>
      </div>
      <nav>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href='/'>
              <a>Home</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href='/protected'>
              <a>Protected</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href='/api-example'>
              <a>API</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
