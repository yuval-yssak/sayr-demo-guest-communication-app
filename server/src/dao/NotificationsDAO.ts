import { ObjectID, WithId } from 'mongodb'
import AbstractDAO from './AbstractDAO'

export type INotificationStatus =
  | 'initialized'
  | 'arrived'
  | 'confirmed'
  | 'ignored'
  | 'failed'
export type INotification = WithId<{
  parentAnnouncement: ObjectID
  timestamp: Date
  recipient: {
    id: number
    devices: {
      endpoint: string
      status: INotificationStatus
    }[]
  }
}>

class UsersDAO extends AbstractDAO<INotification> {
  COLLECTION_NAME = 'notifications'
}

export default new UsersDAO()
