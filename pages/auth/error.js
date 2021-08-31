import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Layout from '../../components/layout'
import logo from '../../public/logo.png'
import styles from '../../styles/Home.module.css'

export default function Error() {
  const router = useRouter()
  const { error } = router.query
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Crypto Login example with FCL user signing</title>
          <link rel='icon' href='/logo.png' />
        </Head>

        <main className={styles.main}>
          <Image src={logo} alt='Flow Logo' />
          <h1 className={styles.title}>Crypto Login Example</h1>

          <p>
            <span className={styles.notSignedInText}>{error}</span>
          </p>
          <div>
            <Link href='/'>
              <a>Return Home</a>
            </Link>
          </div>
        </main>
      </div>
    </Layout>
  )
}
