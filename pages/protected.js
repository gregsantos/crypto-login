import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../components/layout'
import AccessDenied from '../components/access-denied'

export default function Page() {
  const [session, loading] = useSession()
  const [users, setUsers] = useState()

  useEffect(() => {
    console.log(`${process.env.NEXT_PUBLIC_URL}/protected`)

    const fetchData = async () => {
      const res = await fetch('/api/users')
      const json = await res.json()
      setUsers(json)
    }
    fetchData()
  }, [session])

  if (typeof window !== 'undefined' && loading) return null

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  return (
    <Layout>
      <h1>All Users</h1>
      <ul>
        {users?.map(u => (
          <li key={u.address}>{u.address}</li>
        ))}
      </ul>
    </Layout>
  )
}
