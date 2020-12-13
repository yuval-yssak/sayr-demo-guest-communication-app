import AnnouncementsDAO from '../../dao/AnnouncementsDAO'
import { Resolver, Arg, Mutation, Query } from 'type-graphql'
import AnnouncementResponse from '../schema/AnnouncementResponse'
import { ObjectID } from 'mongodb'

@Resolver()
export class AnnouncementResolver {
  @Mutation(() => AnnouncementResponse)
  async createAnnouncement(
    @Arg('subject') subject: string,
    @Arg('body') body: string,
    @Arg('valid', { defaultValue: true }) valid: boolean,
    @Arg('image', { nullable: true }) image?: string
  ): Promise<AnnouncementResponse> {
    const announcement = {
      subject,
      body,
      valid,
      image,
      created_at: new Date(),
      updated_at: new Date()
    }
    const result = await AnnouncementsDAO.insertOne(announcement)
    return new AnnouncementResponse(result.ops[0])
  }

  @Query(() => [AnnouncementResponse])
  async getAllValidAnnouncements(): Promise<AnnouncementResponse[]> {
    const announcements = await AnnouncementsDAO.findArray({ valid: true })
    return announcements.map(
      announcement => new AnnouncementResponse(announcement)
    )
  }

  @Mutation(() => Boolean)
  async invalidateAnnouncement(@Arg('_id') _id: string): Promise<boolean> {
    const result = await AnnouncementsDAO.updateOne(
      { _id: new ObjectID(_id) },
      { $set: { valid: false } }
    )
    return result.result.nModified === 1
  }
}
