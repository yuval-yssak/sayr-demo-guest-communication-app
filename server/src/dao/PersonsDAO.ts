import { WithId } from 'mongodb'
import AbstractDAO from './AbstractDAO'

export type IPersons = WithId<{
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
  }
}>

class PersonsDAO extends AbstractDAO<IPersons> {
  COLLECTION_NAME = 'persons'
}

export default new PersonsDAO()
