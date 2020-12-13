import { ObjectID, WithId } from 'mongodb'
import AbstractDAO from './AbstractDAO'

export type ISchedule = WithId<{
  parentAnnouncement: ObjectID
  timestamp: Date
  recipient: {
    id: number
    devices: {
      endpoint: string
      status: 'arrived' | 'confirmed' | 'ignored' | 'failed'
    }[]
  }
}>

class UsersDAO extends AbstractDAO<ISchedule> {
  COLLECTION_NAME = 'notifications'
}

export default new UsersDAO()
