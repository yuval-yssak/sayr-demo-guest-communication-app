import express from 'express'
import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './userResolvers'

const app = express()

app.get('/', (_req, res) => res.send('hello'))

async function start() {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver] })
  })

  apolloServer.applyMiddleware({ app })
  app.listen(4000, () => console.log('listening on port 4000.'))
}

start()
