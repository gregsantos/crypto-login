import { PrismaClient } from '@prisma/client'
import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

const prisma = new PrismaClient()

async function login(addr) {
  return await prisma.user.upsert({
    where: { address: addr },
    create: { address: addr, status: 'approved' },
    update: { status: 'approved' },
  })
}

export default async function handler(req, res) {
  await cors(req, res)

  const { addr } = req.body
  await login(addr)
    .catch(e => {
      throw e
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
    .then(user => {
      res.status(200).json(user)
    })
}
