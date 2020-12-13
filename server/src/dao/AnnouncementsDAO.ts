import { WithId } from 'mongodb'
import AbstractDAO from './AbstractDAO'

export type ISchedule = WithId<{
  subject: string
  body: string
  image: string
  valid: boolean
  created_at: Date
  updated_at: Date
}>

class UsersDAO extends AbstractDAO<ISchedule> {
  COLLECTION_NAME = 'announcements'
}

export default new UsersDAO()
