import abstractDAO from './abstractDAO'

class lodgingsDAO extends abstractDAO {
  COLLECTION_NAME = 'users'
}

export default new lodgingsDAO()
