import { Instance, destroy, flow } from 'mobx-state-tree'
import { RootStoreBase } from './RootStore.base'
import { View } from './View'
import { LoggedInUser } from './loggedInUser'
import { localStorageMixin } from 'mst-gql'
import { LoginResponseModelType } from '.'

export interface RootStoreType extends Instance<typeof RootStore.Type> {}

export const RootStore = RootStoreBase.props({
  view: View,
  loggedInUser: LoggedInUser
})
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    },

    setLoggedInUser(input: Instance<typeof self.loggedInUser>) {
      self.loggedInUser = input
        ? LoggedInUser.create({ accessToken: input.accessToken })
        : null
    },

    login({ email, password }: { email: string; password: string }) {
      const query = self.mutateLogin({ email, password })
      query.then(
        data =>
          (self.loggedInUser = LoggedInUser.create({
            accessToken: data.login.accessToken!
          })),
        error => console.error(error)
      )
      return query
    },

    loginWithGoogle() {
      window.location.replace(
        `${process.env.REACT_APP_SERVER_BASE_URL}/guest-app/login-with-google`
      )
    },

    finishGoogleLogin: flow(function* () {
      try {
        const query: {
          finishLoginWithGoogle: LoginResponseModelType
        } = yield self.mutateFinishLoginWithGoogle({}).promise

        self.loggedInUser = LoggedInUser.create({
          accessToken: query.finishLoginWithGoogle.accessToken!
        })
      } catch (e) {
        console.error('error on "finished google login", ', e)
      } finally {
        self.view.openHomePage()
      }
    }),

    logout() {
      console.log('logging out')
      self.mutateLogout()
      self.loggedInUser && destroy(self.loggedInUser)
    }
  }))
  .actions(self => ({
    refreshAccessToken: flow(function* refreshToken() {
      const response: Response = yield fetch(
        `${process.env.REACT_APP_SERVER_BASE_URL}/refresh-token`,
        {
          method: 'POST',
          credentials: 'include'
        }
      )
      const json: { accessToken: string; ok: boolean } = yield response.json()
      if (json.ok) {
        self.loggedInUser = LoggedInUser.create({
          accessToken: json.accessToken
        })
      } else self.logout()
    })
  }))

  .extend(localStorageMixin({ filter: ['loggedInUser'], throttle: 2000 }))
