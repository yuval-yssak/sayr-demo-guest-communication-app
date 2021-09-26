import AnnouncementsDAO, {
  AnnouncementDA,
  Audience
} from '../../dao/AnnouncementsDAO'
import { Resolver, Arg, Mutation, Query, Ctx } from 'type-graphql'
import {
  AnnouncementResponse,
  CreateAnnouncementInput
} from '../schema/Announcement'
import { ObjectId } from 'mongodb'
import { Context } from 'src/auth/auth'

@Resolver(_of => AnnouncementResponse)
export class AnnouncementResolver {
  @Mutation(() => AnnouncementResponse)
  async createAnnouncement(
    @Arg('newAnnouncement') newAnnouncement: CreateAnnouncementInput,
    @Ctx() ctx: Context
  ): Promise<AnnouncementResponse> {
    const announcement: AnnouncementDA = {
      ...newAnnouncement,
      publishStart: newAnnouncement.publishStart || new Date(),
      createdAt: new Date(),
      createdByUser: ctx.payload?.userId || 'not a user yet',
      confirmations: []
    }

    const result = await AnnouncementsDAO.insertOne(announcement)

    return Object.assign(new AnnouncementResponse(), announcement, {
      id: result.insertedId
    })
  }

  // TODO: If authorized only - give stats
  @Query(() => [AnnouncementResponse])
  async getActiveAnnouncements(): Promise<AnnouncementResponse[]> {
    const activeAnnouncements = await AnnouncementsDAO.findArray({
      publishEnd: { $gte: new Date() }
    })
    return activeAnnouncements.map(announcement => {
      // get all persons who are meant to get this announcement
      // iterate through the confirmations and match them to the persons.
      // build the stats array with the persons and fill out their read timestamps

      if (announcement.audience === Audience.ALL_KARMA_YOGIS) {
      }
      const stats = [
        {
          person: {
            id: new ObjectId('123412341234123412341234'),
            name: 'John'
          },
          readTimestamp:
            Math.random() > 0.5 ? null : new Date(Date.now() - 1000 * 3600)
        }
      ]

      const fullResponse: AnnouncementResponse = {
        ...announcement,
        stats
      }

      return Object.assign(new AnnouncementResponse(), fullResponse)
    })
  }

  @Query(() => [AnnouncementResponse])
  async getArchivedAnnouncements(): Promise<AnnouncementResponse[]> {
    const archivedAnnouncements = await AnnouncementsDAO.findArray({
      publishEnd: { $lt: new Date() }
    })
    return archivedAnnouncements.map(announcement =>
      Object.assign(new AnnouncementResponse(), announcement)
    )
  }

  @Mutation(() => Boolean)
  async invalidateAnnouncement(@Arg('_id') _id: string): Promise<boolean> {
    const result = await AnnouncementsDAO.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { valid: false } }
    )

    return result.modifiedCount === 1
  }
}
