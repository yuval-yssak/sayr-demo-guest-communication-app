import { mongoDBConfig } from '../../config/config'
import { MongoClient } from 'mongodb'
import { connect } from './mongoClient'
import UsersDAO from '../dao/usersDAO'

let dbClient: MongoClient

async function loadDataAccess(customDBName?: string) {
  const resolvedDBName = customDBName || mongoDBConfig.dbName

  dbClient = await connect()
  await UsersDAO.init(dbClient, resolvedDBName)
}

async function closeDataAccess() {
  await dbClient.close()
  console.log('MongoDB: Connection successfully closed')
}

export { loadDataAccess, closeDataAccess }
