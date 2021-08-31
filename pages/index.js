import Head from 'next/head'
import { useCallback, useState } from 'react'
import { reauthenticate, currentUser, verifyUserSignatures } from '@onflow/fcl'
import { signIn, useSession } from 'next-auth/client'
import Image from 'next/image'
import Layout from '../components/layout'
import logo from '../public/logo.png'
import styles from '../styles/Home.module.css'

const fetchApi = endpoint => {
  return fetch(`/api/${endpoint}`).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
}

export const authenticate = async () => {
  const currentUser = await reauthenticate()
  const MSG = `
    Hi there from crypto-login! 
    Sign this message to prove you have 
    access to this wallet and we’ll log 
    you in with address ${currentUser.addr}
    This won’t cost you any Flow.
  `
  const msg = Buffer.from(MSG).toString('hex')
  const compSigs = await sign(msg)
  try {
    const verified = await verifyUserSignatures(msg, compSigs)
    verified && loginWithCreds(currentUser)
  } catch (e) {
    console.log('Error verifying signatures', e)
  }
}

async function sign(msg) {
  return await currentUser()
    .signUserMessage(msg)
    .catch(e => {
      throw e
    })
    .then(cs => cs)
}

async function loginWithCreds({ addr }) {
  try {
    const resp = await signIn('credentials', {
      callbackUrl: `${process.env.NEXT_PUBLIC_URL}/protected`,
      addr: addr,
    })
    console.log('AUTH RES', resp)
  } catch (error) {
    console.log('AUTH ERR', error)
  }
}

export default function Home() {
  const [session, loading] = useSession()
  const [isLoadingPost, setLoadingPost] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)
  const [apiError, setApiError] = useState(null)

  const getApiCallback = useCallback(
    endpoint => async e => {
      setLoadingPost(true)
      setApiError(null)
      try {
        const response = await fetchApi(endpoint)
        setApiResponse(response)
      } catch (e) {
        setApiError(e)
        console.error(e)
      }
      setLoadingPost(false)
    },
    []
  )

  const onGetUsers = useCallback(getApiCallback('users'), [])

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
          {!session && (
            <>
              <span className={styles.notSignedInText}>
                You are not signed in
              </span>
              <div>
                <button onClick={authenticate} className={styles.apiButton}>
                  Login with Crypto
                </button>
              </div>
            </>
          )}

          {session && (
            <>
              <div>
                <button onClick={onGetUsers} className={styles.apiButton}>
                  Load Users
                </button>
                <div
                  className={`${styles.loader} ${
                    isLoadingPost ? '' : styles.hidden
                  }`}
                ></div>
              </div>
              <pre
                className={`responseContainer ${styles.code} ${
                  apiResponse ? '' : styles.hidden
                }`}
              >
                {apiResponse && JSON.stringify(apiResponse, null, 2)}
              </pre>
            </>
          )}
        </main>
      </div>
    </Layout>
  )
}
