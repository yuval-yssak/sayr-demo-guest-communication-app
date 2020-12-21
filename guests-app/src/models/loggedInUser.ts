import { types } from 'mobx-state-tree'
import jwtDecode from 'jwt-decode'
import { now } from 'mobx-utils'

const loggedInUser = types.maybeNull(
  types
    .model('loggedInUser', {
      accessToken: types.string,
      isOnline: types.optional(types.boolean, window.navigator.onLine)
    })
    .views(self => ({
      get id(): string {
        return self.accessToken
          ? (jwtDecode(self.accessToken) as any).userId
          : ''
      },
      isTokenValidWithMargin(gapInMilliseconds: number) {
        if (self.accessToken) {
          const { exp } = jwtDecode(self.accessToken)

          return exp && now() + gapInMilliseconds < exp * 1000
        } else return false
      }
    }))
    .views(self => ({
      get isTokenValid() {
        return self.isTokenValidWithMargin(0)
      },
      get email(): string {
        return self.accessToken
          ? (jwtDecode(self.accessToken) as any).email
          : ''
      }
    }))
    .actions(self => ({
      setOnlineStatus(status: boolean) {
        self.isOnline = status
      }
    }))
    .actions(self => ({
      afterCreate() {
        // register listeners to observe navigator.online status via Mobx.
        window.addEventListener('online', () => self.setOnlineStatus(true))
        window.addEventListener('offline', () => self.setOnlineStatus(false))
      },
      setAccessToken(newToken: string) {
        console.log('setting new access token')
        self.accessToken = newToken
      }
    }))
)

export default loggedInUser
