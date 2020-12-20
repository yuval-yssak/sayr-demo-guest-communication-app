import { IAnnouncement } from '../../dao/AnnouncementsDAO'
import { Field, ID, ObjectType } from 'type-graphql'
import { ObjectID } from 'mongodb'

@ObjectType()
export default class AnnouncementResponse implements IAnnouncement {
  _id: ObjectID
  @Field(() => ID) id: ObjectID
  @Field() subject: string
  @Field() body: string
  @Field({ nullable: true }) image?: string
  @Field() valid: boolean
  @Field() created_at: Date
  @Field() updated_at: Date

  constructor(announcement: IAnnouncement) {
    this.id = this._id = announcement._id
    this.subject = announcement.subject
    this.body = announcement.body
    this.image = announcement.image
    this.valid = announcement.valid
    this.created_at = announcement.created_at
    this.updated_at = announcement.updated_at
  }
}
