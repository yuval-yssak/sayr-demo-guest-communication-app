import { Resolver, Query, ObjectType, Field } from 'type-graphql'
import usersDAO from './dao/usersDAO'
import { calendar_v3, Auth } from 'googleapis'

@ObjectType()
class Event {
  @Field()
  summary: string

  @Field()
  start: Date

  @Field()
  end: Date

  constructor(summary: string, start: Date, end: Date) {
    this.summary = summary
    this.start = start
    this.end = end
  }
}

@Resolver()
class CalendarResolver {
  @Query(() => [Event])
  async getEvents() {
    try {
      const auth = new Auth.OAuth2Client()
      auth.setCredentials({
        access_token: (
          await usersDAO.findArray({ email: 'iswara@sivananda.org' })
        )?.[0].oauth?.google?.accessToken
      })

      const cal = new calendar_v3.Calendar({ auth })
      const events = await cal.events.list({
        calendarId: 'iswara@sivananda.org'
      })

      const filteredEvents =
        events.data.items
          ?.filter(
            event =>
              (event.start?.date || event.start?.dateTime) &&
              (event.end?.date || event.end?.dateTime)
          )
          .map(
            event =>
              new Event(
                event.summary || '',
                new Date((event.start?.date || event.start?.dateTime)!),
                new Date((event.end?.date || event.end?.dateTime)!)
              )
          ) || []

      console.log('sync token  ', events.data.nextSyncToken)
      console.log('page token  ', events.data.nextPageToken)
      return filteredEvents
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
export { CalendarResolver }
