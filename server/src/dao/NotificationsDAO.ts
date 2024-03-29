import { ObjectId, WithId } from 'mongodb'
import AbstractDAO from './AbstractDAO'

export type INotificationStatus =
  | 'initialized'
  | 'arrived'
  | 'confirmed'
  | 'ignored'
  | 'failed'
export type INotification = WithId<{
  parentAnnouncement: ObjectId
  timestamp: Date
  recipient: {
    id: ObjectId
    devices: {
      endpoint: string
      status: INotificationStatus
    }[]
  }
}>

class NotificationsDAO extends AbstractDAO<INotification> {
  COLLECTION_NAME = 'notifications'
}

export default new NotificationsDAO()
