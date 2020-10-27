import { types } from 'mobx-state-tree'

const loggedInUser = types.maybeNull(
  types
    .model('loggedInUser', {
      id: types.identifier,
      accessToken: types.string
    })
    .actions(self => ({
      setAccessToken(newToken: string) {
        self.accessToken = newToken
      }
    }))
)

export default loggedInUser
