import { WithId } from 'mongodb'
import AbstractDAO from './AbstractDAO'

export type IChatMessage = WithId<{
  guest_id: number
  timestamp: Date
  text: string
  from: 'guest' | 'staff'
  read: boolean
}>

class ChatMessagesDAO extends AbstractDAO<IChatMessage> {
  COLLECTION_NAME = 'chatMessages'
}

export default new ChatMessagesDAO()
