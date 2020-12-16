import { Resolver, Arg, Mutation, Field, InputType, Int } from 'type-graphql'
import { ObjectID } from 'mongodb'
import NotificationResponse from '../schema/NotificationResponse'
import NotificationsDAO, { INotification } from '../../dao/NotificationsDAO'
import UsersDAO from '../../dao/UsersDAO'
import AnnouncementsDAO from '../../dao/AnnouncementsDAO'
import webPush from 'web-push'

@InputType()
class PersonInput {
  @Field(() => Int)
  id: number
}

console.log(PersonInput)
@Resolver()
export class NotificationResolver {
  @Mutation(() => [NotificationResponse])
  async createNotificationsForAnnouncement(
    @Arg('persons', () => [PersonInput]) persons: PersonInput[],
    @Arg('announcementID') announcementID: string
  ): Promise<NotificationResponse[]> {
    const [anAnnouncement] = await AnnouncementsDAO.findArray({
      _id: new ObjectID(announcementID)
    })
    const users = await UsersDAO.findArray({
      personId: { $in: persons.map(p => p.id) }
    })
    const usersWithSubscriptions = users.filter(
      user => user.subscriptions.length
    )
    // get recipient endpoints

    const results = await Promise.all(
      usersWithSubscriptions.map(async user => {
        webPush.setVapidDetails(
          'mailto:a@example.com',
          'BFsdpKVL7oSeZspZ8Aa6pyaW1oQbI11bmd_-bpduPnS9_UT8DRhCp3gdTZ_2e9HpFrTfU-lqZuj98Tvvva2-Zdw',
          'ESrGXUAklUux9U-IuHL1QXLiORiiHEOikyi8tFs7GKM'
        )
        user.subscriptions.map(sub => {
          console.log('sending notifications', sub)
          webPush.sendNotification(
            { endpoint: sub.endpoint, keys: sub.keys },
            JSON.stringify({
              title: anAnnouncement.subject,
              content: anAnnouncement.body
            })
          )
        })
        return await NotificationsDAO.insertOne({
          parentAnnouncement: new ObjectID(announcementID),
          recipient: {
            id: user.personId!,
            devices: user.subscriptions.map(sub => ({
              status: 'initialized',
              endpoint: sub.endpoint
            }))
          },
          timestamp: new Date()
        })
      })
    )

    const resultArray = results.flatMap(result => result.ops as INotification[])

    const [announcement] = await AnnouncementsDAO.findArray({
      _id: new ObjectID(announcementID)
    })
    // create notifications entries with the endpoints, set status to initial

    return resultArray
      .map(result => ({ ...result, parentAnnouncement: announcement }))
      .map(result => new NotificationResponse(result))
  }
}
