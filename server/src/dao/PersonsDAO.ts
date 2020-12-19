import { WithId } from 'mongodb'
import AbstractDAO from './AbstractDAO'

export type IPerson = WithId<{
  id: number
  full_name: string
  first_name: string
  last_name: string
  email: string
  registered: string
  questions: {
    firstname: string
    lastname: string
    email: string
    'spiritual-name'?: string
    'headshot-url': string
  }
}>

class PersonsDAO extends AbstractDAO<IPerson> {
  COLLECTION_NAME = 'persons'
}

export default new PersonsDAO()
