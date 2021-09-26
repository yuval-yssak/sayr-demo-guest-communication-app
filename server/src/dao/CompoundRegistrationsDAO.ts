import { MongoClient, WithId } from 'mongodb'
import { Registration, RegistrationMatched, RegistrationStatus } from ''
import AbstractDAO from './AbstractDAO'

export type CompoundPerson = {
  id: number
  registrations: RegistrationMatched[]
  otherRegistrations?: {
    id: number
    status: RegistrationStatus
    start_date: string
    end_date: string
    room: string | null
    program: string
  }[]
}

export type Compound = {
  persons?: CompoundPerson[]
  unmatchedRegistrations?: Registration[]
}

class CompoundsDAO extends AbstractDAO<WithId<Compound>> {
  COLLECTION_NAME = 'compounds'

  async init(client: MongoClient, dbName: string): Promise<void> {
    await super.init(client, dbName)
    await this.collection.createIndexes([
      { key: { 'persons.id': 1 } },
      { key: { 'persons.registrations.id': 1 } },
      { key: { 'persons.registrations.person_id': 1 } },
      { key: { 'persons.registrations.parent_registration_id': 1 } },
      { key: { 'persons.registrations.status': 1 } },
      { key: { 'persons.registrations.start_date': 1 } },
      { key: { 'persons.registrations.end_date': 1 } },
      { key: { 'persons.registrations.email': 1 } },
      {
        key: {
          'persons.registrations.room': 1,
          'persons.registrations.start_date': 1,
          'persons.registrations.end_date': -1
        }
      },
      { key: { 'unmatchedRegistrations.id': 1 } },
      { key: { 'unmatchedRegistrations.person_id': 1 } },
      { key: { 'unmatchedRegistrations.parent_registration_id': 1 } },
      { key: { 'unmatchedRegistrations.status': 1 } },
      { key: { 'unmatchedRegistrations.start_date': 1 } },
      { key: { 'unmatchedRegistrations.end_date': 1 } },
      { key: { 'unmatchedRegistrations.email': 1 } },
      {
        key: {
          'unmatchedRegistrations.room': 1,
          'unmatchedRegistrations.start_date': 1,
          'unmatchedRegistrations.end_date': -1
        }
      }
    ])
  }
}

export default new CompoundsDAO()
