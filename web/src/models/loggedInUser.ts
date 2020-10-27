import { types } from 'mobx-state-tree'

const loggedInUser = types.maybeNull(
  types.model('loggedInUser', {
    id: types.identifier,
    accessToken: types.string
  })
)

export default loggedInUser
