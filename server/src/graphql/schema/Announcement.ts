import { Announcement, Audience } from '../../dao/AnnouncementsDAO'
import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType
} from 'type-graphql'
import { ObjectId } from 'mongodb'

registerEnumType(Audience, {
  name: 'Audience',
  description: 'types of allowed audiences for an announcement'
})

@ObjectType()
class PersonResponse {
  @Field(() => ID) id: ObjectId
  @Field() name: string
}

@ObjectType()
class AnnouncementStatsResponse {
  @Field() person: PersonResponse
  @Field(_type => Date, { nullable: true }) readTimestamp: Date | null
}

@ObjectType()
export class AnnouncementResponse implements Announcement {
  @Field(_type => ID) _id: ObjectId
  @Field() subject: string
  @Field() body: string
  @Field() publishStart: Date
  @Field() publishEnd: Date
  @Field() sendAlert: boolean
  @Field(_type => String) priority: Announcement['priority']
  @Field(_type => Audience) audience: Audience
  @Field() createdAt: Date
  @Field(() => ID) createdByUser: ObjectId
  @Field(_type => [AnnouncementStatsResponse])
  stats: AnnouncementStatsResponse[]
}

@InputType()
export class CreateAnnouncementInput implements Partial<Announcement> {
  @Field() subject: string
  @Field() body: string
  @Field({ nullable: true }) publishStart: Date
  @Field() publishEnd: Date
  @Field() sendAlert: boolean
  @Field(_type => String) priority: Announcement['priority']
  @Field(_type => Audience) audience: Audience
}
