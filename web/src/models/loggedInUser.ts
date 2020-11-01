import { types, flow } from 'mobx-state-tree'
import jwtDecode from 'jwt-decode'
import { now } from 'mobx-utils'

const loggedInUser = types.maybeNull(
  types
    .model('loggedInUser', {
      accessToken: types.string
    })
    .views(self => ({
      get id() {
        const { userId } = jwtDecode(self.accessToken)

        return userId
      },
      isTokenValidWithMargin(gapInMilliseconds: number) {
        const { exp } = jwtDecode(self.accessToken)

        return exp && now() + gapInMilliseconds < exp * 1000
      }
    }))
    .views(self => ({
      get isTokenValid() {
        return self.isTokenValidWithMargin(0)
      },
      get email() {
        const { email } = jwtDecode(self.accessToken)
        return email
      }
    }))
    .actions(self => ({
      setAccessToken(newToken: string) {
        console.log('setting new access token')
        self.accessToken = newToken
      }
    }))
    .actions(self => ({
      refreshToken: flow(function* refreshToken() {
        const response: Response = yield fetch(
          'http://localhost:4000/refresh-token',
          {
            method: 'POST',
            credentials: 'include'
          }
        )
        const json: { accessToken: string } = yield response.json()
        self.setAccessToken(json.accessToken)
      })
    }))
)

export default loggedInUser
