import { ObjectId, WithId } from 'mongodb'
import AbstractDAO from './AbstractDAO'

export enum Audience {
  ALL_RESIDENTS_AND_VISITORS = 'ALL_RESIDENTS_AND_VISITORS',
  ALL_RESIDENTS = 'ALL_RESIDENTS',
  ALL_RESIDENTS_GUESTS = 'ALL_RESIDENTS_GUESTS',
  ALL_RESIDENTS_GUESTS_NO_CHILDREN = 'ALL_RESIDENTS_GUESTS_NO_CHILDREN',
  ALL_STAFF_KARMA_YOGIS = 'ALL_STAFF_KARMA_YOGIS',
  ALL_KARMA_YOGIS = 'ALL_KARMA_YOGIS',
  ALL_STAFF = 'ALL_STAFF',
  ALL_SPEAKERS = 'ALL_SPEAKERS',
  STUDENTS_IN_COURSE = 'STUDENTS_IN_COURSE'
}

export type Announcement = {
  subject: string
  body: string
  createdAt: Date
  createdByUser: ObjectId
  publishStart: Date
  publishEnd: Date
  sendAlert: boolean
  priority: 'low' | 'high'
  audience: Audience
}

export type AnnouncementDA = Announcement & {
  confirmations: { personId: number; timestamp: Date }[]
}

class AnnouncementsDAO extends AbstractDAO<WithId<AnnouncementDA>> {
  COLLECTION_NAME = 'announcements'
}

export default new AnnouncementsDAO()
