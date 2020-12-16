import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './graphql/resolvers/UserResolver'
import { CompoundResolver } from './graphql/resolvers/CompoundResolver'
import { loadDataAccess } from './loaders/mainLoader'
import authRoutes from './routes/authRoutes'
import app from './expressApp'
import { AnnouncementResolver } from './graphql/resolvers/AnnouncementResolver'
import { NotificationResolver } from './graphql/resolvers/NotificationResolver'
import { DayActivitiesResolver } from './graphql/resolvers/DayActivitiesResolver'

async function start() {
  await loadDataAccess()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        CompoundResolver,
        AnnouncementResolver,
        NotificationResolver,
        DayActivitiesResolver
      ]
    }),
    context: ({ req, res }) => ({ req, res })
  })

  apolloServer.applyMiddleware({ app, cors: false })
  app.listen(4000, () => console.log('listening on port 4000.'))
}

start()

authRoutes(app)
