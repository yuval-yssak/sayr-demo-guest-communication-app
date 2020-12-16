import { WithId } from 'mongodb'
import AbstractDAO from './AbstractDAO'

export type ISchedule = WithId<{
  guest_id: number
  timestamp: Date
  text: string
  from: 'guest' | 'staff'
  read: boolean
}>

class ChatMessagesDAO extends AbstractDAO<ISchedule> {
  COLLECTION_NAME = 'chatMessages'
}

export default new ChatMessagesDAO()
