import { ObjectId, WithId } from 'mongodb'
import AbstractDAO from './AbstractDAO'

export type ISchedule = WithId<{
  date: string
  activities: {
    id: ObjectId
    from: string
    to: string
    name: string
    description: string
    location: string
  }[]
}>

class ScheduleDAO extends AbstractDAO<ISchedule> {
  COLLECTION_NAME = 'schedule'
}

export default new ScheduleDAO()
