import express from 'express'
import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './userResolvers'
import { loadDataAccess } from './loaders/mainLoader'
import cookieParser from 'cookie-parser'
import { verify } from 'jsonwebtoken'
import { jwt } from '../config/config'
import usersDao from './dao/usersDAO'
import { createAccessToken, LoginPayload } from './auth'
import { ObjectId } from 'mongodb'

const app = express()
app.use(cookieParser())
app.get('/', (_req, res) => res.send('hello'))

app.post('/refresh-token', async (req, res) => {
  const token: string = req.cookies.rx
  if (!token) res.send({ ok: false, accessToken: '' })
  let payload: LoginPayload

  try {
    payload = verify(token, jwt.secretKeyForRefresh) as LoginPayload
  } catch (e) {
    console.error(e)
    return res.send({ ok: false, accessToken: '' })
  }

  const user = (
    await usersDao.findArray({ _id: new ObjectId(payload.userId) })
  )?.[0]
  if (!user) return res.send({ ok: false, accessToken: '' })

  return res.send({ ok: true, accessToken: createAccessToken(user) })
})

async function start() {
  await loadDataAccess()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver] }),
    context: ({ req, res }) => ({ req, res })
  })

  apolloServer.applyMiddleware({ app })
  app.listen(4000, () => console.log('listening on port 4000.'))
}

start()
