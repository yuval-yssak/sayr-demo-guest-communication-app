import { ISchedule } from '../../dao/ScheduleDAO'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { ObjectId } from 'mongodb'

@ObjectType()
export class Activity {
  @Field(_type => ID) id: ObjectId
  @Field() from: string
  @Field() to: string
  @Field() name: string
  @Field() description: string
  @Field() location: string

  constructor(activity: ISchedule['activities'][number]) {
    this.id = activity.id
    this.from = activity.from
    this.to = activity.to
    this.name = activity.name
    this.description = activity.description
    this.location = activity.location
  }
}

@InputType()
export class ActivityInput implements Partial<Activity> {
  @Field() from: string
  @Field() to: string
  @Field() name: string
  @Field() description: string
  @Field() location: string
}

@ObjectType()
export class DayActivities {
  @Field() date: string
  @Field(_type => [Activity]) activities: Activity[]

  constructor(dayActivities: ISchedule) {
    this.date = dayActivities.date
    this.activities = dayActivities.activities.map(
      activity => new Activity(activity)
    )
  }
}
