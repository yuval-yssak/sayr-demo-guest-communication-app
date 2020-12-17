import { mongoDBConfig } from '../../config/config'
import { MongoClient } from 'mongodb'
import { connect } from './mongoClient'
import UsersDAO from '../dao/UsersDAO'
import CompoundRegistrationsDAO from '../dao/CompoundRegistrationsDAO'
import AnnouncementsDAO from '../dao/AnnouncementsDAO'
import ChatMessagesDAO from '../dao/ChatMessagesDAO'
import NotificationsDAO from '../dao/NotificationsDAO'
import ScheduleDAO from '../dao/ScheduleDAO'
import PersonsDAO from '../dao/PersonsDAO'

let dbClient: MongoClient

async function loadDataAccess(customDBName?: string) {
  const resolvedDBName = customDBName || mongoDBConfig.dbName

  dbClient = await connect()
  await UsersDAO.init(dbClient, resolvedDBName)
  await CompoundRegistrationsDAO.init(dbClient, resolvedDBName)
  await AnnouncementsDAO.init(dbClient, resolvedDBName)
  await ChatMessagesDAO.init(dbClient, resolvedDBName)
  await NotificationsDAO.init(dbClient, resolvedDBName)
  await ScheduleDAO.init(dbClient, resolvedDBName)
  await PersonsDAO.init(dbClient, resolvedDBName)
}

async function closeDataAccess() {
  await dbClient.close()
  console.log('MongoDB: Connection successfully closed')
}

export { loadDataAccess, closeDataAccess }
