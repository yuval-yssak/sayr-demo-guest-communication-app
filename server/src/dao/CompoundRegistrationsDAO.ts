import { MongoClient, WithId } from 'mongodb'
import AbstractDAO from './AbstractDAO'

export type ITransactionStatus = 'cancel' | 'complete' | 'fail'
export type IPayment = any & { status: ITransactionStatus } // TODO: type this
export type IItem = any & { status: ITransactionStatus } // TODO: type this

export type IRegistrationStatus =
  | 'checked-out'
  | 'reserved'
  | 'cancelled'
  | 'arrived'
export type IRegistration = {
  id: number
  parent_registration_id?: number
  status: IRegistrationStatus

  submitted: string
  start_date: string
  end_date: string
  first_name: string
  last_name: string
  email: string
  program: string
  program_id: number
  room_id: number
  room: string | null
  lodging_id: number
  lodging: string | null
  total_items: number
  total_payments: number
  total_taxes: number
  grand_total: number
  balance_due: number
  registration_total: number
  questions: {
    [q: string]: string
  }
  payments?: IPayment[]
  items?: IItem[]
}

export type IMatchedRegistration = IRegistration & {
  person_id: number
}

export type IPerson = {
  id: number
  registrations: IMatchedRegistration[]
}

export type ICompoundRegistration = WithId<{
  persons?: IPerson[]
  unmatchedRegistrations?: IRegistration[]
}>

class CompoundRegistrationsDAO extends AbstractDAO<ICompoundRegistration> {
  COLLECTION_NAME = 'compoundRegistrations'

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

export default new CompoundRegistrationsDAO()
