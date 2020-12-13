import { Field, ID, ObjectType } from 'type-graphql'
import { ObjectID } from 'mongodb'
import AnnouncementResponse from './AnnouncementResponse'
import { IAnnouncement } from '../../dao/AnnouncementsDAO'
import { INotificationStatus } from '../../dao/NotificationsDAO'

@ObjectType()
export class Device {
  @Field() endpoint: string
  @Field(() => String) status: INotificationStatus

  constructor(device: { endpoint: string; status: INotificationStatus }) {
    this.endpoint = device.endpoint
    this.status = device.status
  }
}

@ObjectType()
export class Recipient {
  @Field() id: number
  @Field(() => [Device]) devices: Device[]

  constructor(recipient: { id: number; devices: Device[] }) {
    this.id = recipient.id
    this.devices = recipient.devices.map(device => new Device(device))
  }
}

@ObjectType()
export default class NotificationResponse {
  @Field(() => ID) _id: ObjectID
  @Field() parentAnnouncement: AnnouncementResponse
  @Field() timestamp: Date
  @Field() recipient: Recipient

  constructor(notification: {
    _id: ObjectID
    parentAnnouncement: IAnnouncement
    timestamp: Date
    recipient: {
      id: number
      devices: {
        endpoint: string
        status: INotificationStatus
      }[]
    }
  }) {
    this._id = notification._id
    this.parentAnnouncement = notification.parentAnnouncement
    this.timestamp = notification.timestamp
    this.recipient = new Recipient(notification.recipient)
  }
}
