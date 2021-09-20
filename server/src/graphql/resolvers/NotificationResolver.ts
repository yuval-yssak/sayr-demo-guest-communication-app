import { Resolver, Arg, Mutation, Field, InputType } from 'type-graphql'
import { ObjectId } from 'mongodb'
import NotificationResponse from '../schema/NotificationResponse'
import NotificationsDAO, { INotification } from '../../dao/NotificationsDAO'
import UsersDAO from '../../dao/UsersDAO'
import AnnouncementsDAO from '../../dao/AnnouncementsDAO'
import webPush from 'web-push'
import { webPushVapid } from '../../config/config'

@InputType()
class PersonInput {
  @Field(() => String)
  id: string
}

@Resolver()
export class NotificationResolver {
  @Mutation(() => [NotificationResponse])
  async createNotificationsForAnnouncement(
    @Arg('persons', () => [PersonInput]) persons: PersonInput[],
    @Arg('announcementID') announcementID: string
  ): Promise<NotificationResponse[]> {
    const [anAnnouncement] = await AnnouncementsDAO.findArray({
      _id: new ObjectId(announcementID)
    })
    const users = await UsersDAO.findArray({
      _id: { $in: persons.map(p => new ObjectId(p.id)) }
    })
    const usersWithSubscriptions = users.filter(
      user => user.subscriptions.length
    )
    // get recipient endpoints

    const insertObjects = usersWithSubscriptions.map(user => {
      webPush.setVapidDetails(
        webPushVapid.subject,
        webPushVapid.publicKey,
        webPushVapid.privateKey
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

      return {
        parentAnnouncement: new ObjectId(announcementID),
        recipient: {
          id: user._id,
          devices: user.subscriptions.map(sub => ({
            status: 'initialized',
            endpoint: sub.endpoint
          }))
        },
        timestamp: new Date()
      } as INotification
    })

    const inserts = insertObjects.map(async insertObject => {
      return await NotificationsDAO.insertOne(insertObject)
    })

    await Promise.all(inserts)

    const [announcement] = await AnnouncementsDAO.findArray({
      _id: new ObjectId(announcementID)
    })
    // create notifications entries with the endpoints, set status to initial

    return insertObjects
      .map(result => ({ ...result, parentAnnouncement: announcement }))
      .map(result => new NotificationResponse(result))
  }
}
