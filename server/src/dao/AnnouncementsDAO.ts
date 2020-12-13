import { WithId } from 'mongodb'
import AbstractDAO from './AbstractDAO'

export type IAnnouncement = WithId<{
  subject: string
  body: string
  image?: string
  valid: boolean
  created_at: Date
  updated_at: Date
}>

class UsersDAO extends AbstractDAO<IAnnouncement> {
  COLLECTION_NAME = 'announcements'
}

export default new UsersDAO()
