import { ObjectId } from 'mongodb'
import ScheduleDAO from '../../dao/ScheduleDAO'
import { Arg, Mutation, Query, Resolver, ID } from 'type-graphql'
import { ActivityInput, DayActivities } from '../schema/DayActivities'

@Resolver()
export class DayActivitiesResolver {
  @Query(() => DayActivities, { nullable: true })
  async getDayActivities(@Arg('date') date: string): Promise<DayActivities> {
    if (!/^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/.test(date))
      throw new Error(
        `date ${date} is not in ISO format. Please submit a date in format YYYY-MM-DD`
      )
    const [dayActivities] = await ScheduleDAO.findArray({ date })
    return dayActivities
  }

  @Mutation(_type => DayActivities)
  async addActivity(
    @Arg('date') date: string,
    @Arg('activity', _type => ActivityInput) activity: ActivityInput
  ): Promise<DayActivities> {
    if (!/^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/.test(date))
      throw new Error(
        `date ${date} is not in ISO format. Please submit a date in format YYYY-MM-DD`
      )

    const [daySchedule] = await ScheduleDAO.findArray({ date })
    if (daySchedule)
      await ScheduleDAO.updateOne(
        { _id: new ObjectId(daySchedule._id) },
        { $push: { activities: { ...activity, id: new ObjectId() } } }
      )
    else
      await ScheduleDAO.insertOne({
        date,
        activities: [{ ...activity, id: new ObjectId() }]
      })

    const [newDaySchedule] = await ScheduleDAO.findArray({ date })
    return new DayActivities(newDaySchedule)
  }

  @Mutation(_type => Boolean)
  async updateActivity(
    @Arg('date') date: string,
    @Arg('activityID', () => ID) activityID: ObjectId,
    @Arg('newActivity', _type => ActivityInput)
    newActivity: ActivityInput
  ): Promise<boolean> {
    if (!/^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/.test(date))
      throw new Error(
        `date ${date} is not in ISO format. Please submit a date in format YYYY-MM-DD`
      )

    const result = await ScheduleDAO.updateOne(
      { date, 'activities.id': new ObjectId(activityID) },
      {
        $set: {
          'activities.$': { ...newActivity, id: new ObjectId(activityID) }
        }
      }
    )
    return result.result.nModified === 1
  }

  @Mutation(_type => Boolean)
  async deleteActivity(
    @Arg('date') date: string,
    @Arg('activityID', () => ID) activityID: ObjectId
  ): Promise<boolean> {
    if (!/^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/.test(date))
      throw new Error(
        `date ${date} is not in ISO format. Please submit a date in format YYYY-MM-DD`
      )

    const result = await ScheduleDAO.updateOne(
      { date, 'activities.id': new ObjectId(activityID) },
      { $pull: { activities: { id: new ObjectId(activityID) } } }
    )
    return result.result.nModified === 1
  }
}
