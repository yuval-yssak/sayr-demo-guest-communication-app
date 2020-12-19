import { Instance, destroy, flow } from 'mobx-state-tree'
import { RootStoreBase } from './RootStore.base'
import { View } from './View'
import loggedInUser from './loggedInUser'
import { localStorageMixin } from 'mst-gql'
import { LoginResponseModelType } from '.'

export interface RootStoreType extends Instance<typeof RootStore.Type> {}

export const RootStore = RootStoreBase.props({
  view: View,
  loggedInUser
})
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    },

    setLoggedInUser(input: Instance<typeof self.loggedInUser>) {
      self.loggedInUser = input
        ? loggedInUser.create({ accessToken: input.accessToken })
        : null
    },

    login({ email, password }: { email: string; password: string }) {
      const query = self.mutateLogin({ email, password })
      query
        .then(
          data =>
            (self.loggedInUser = loggedInUser.create({
              accessToken: data.login.accessToken!
            })),
          error => console.error(error)
        )
        .then(() => self.view.openHomePage())
      return query
    },

    loginWithGoogle() {
      window.location.replace(
        'http://localhost:4000/staff-app/login-with-google'
      )
    },

    finishGoogleLogin: flow(function* () {
      try {
        const query: {
          finishLoginWithGoogle: LoginResponseModelType
        } = yield self.mutateFinishLoginWithGoogle({}).promise

        self.loggedInUser = loggedInUser.create({
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

  .extend(
    localStorageMixin({ filter: ['loggedInUser', 'userTypes'], throttle: 2000 })
  )
