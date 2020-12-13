import { WithId } from 'mongodb'
import AbstractDAO from './AbstractDAO'

export type ISchedule = WithId<{
  date: string
  activities: {
    from: string
    to: string
    name: string
    description: string
    location: string
  }[]
}>

class UsersDAO extends AbstractDAO<ISchedule> {
  COLLECTION_NAME = 'schedule'
}

export default new UsersDAO()
