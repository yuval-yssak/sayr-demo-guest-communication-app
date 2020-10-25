import express from 'express'
import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './userResolvers'
import { loadDataAccess } from './loaders/mainLoader'
import cookieParser from 'cookie-parser'
import { exchangeToken } from './auth'

const app = express()
app.use(cookieParser())
app.get('/', (_req, res) => res.send('hello'))

app.post('/refresh-token', exchangeToken)

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
