import { Instance, destroy, flow, SnapshotOrInstance } from 'mobx-state-tree'
import { RootStoreBase } from './RootStore.base'
import ViewModel from './view'
import loggedInUser from './loggedInUser'
import { localStorageMixin } from 'mst-gql'
import { LoginResponseModelType } from '.'

export interface RootStoreType extends Instance<typeof RootStore.Type> {}

export const RootStore = RootStoreBase.props({
  view: ViewModel,
  loggedInUser
})
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    },

    setLoggedInUser(input: SnapshotOrInstance<typeof self.loggedInUser>) {
      self.loggedInUser = input
        ? loggedInUser.create({
            accessToken: input.accessToken,
            user: input.user.toString()
          })
        : null
    },

    login({ email, password }: { email: string; password: string }) {
      const query = self.mutateLogin({ email, password }, s =>
        s.accessToken.user()
      )
      query
        .then(
          data =>
            (self.loggedInUser = loggedInUser.create({
              accessToken: data.login.accessToken!,
              user: data.login.user.id
            })),
          error => console.error(error)
        )
        .then(() => self.view.openHomepage())
      return query
    },

    loginWithGoogle() {
      window.location.replace('http://localhost:4000/login-with-google')
    },

    finishGoogleLogin: flow(function* () {
      try {
        const query: {
          finishLoginWithGoogle: LoginResponseModelType
        } = yield self.mutateFinishLoginWithGoogle({}, s =>
          s.accessToken.user()
        ).promise

        self.loggedInUser = loggedInUser.create({
          accessToken: query.finishLoginWithGoogle.accessToken!,
          user: query.finishLoginWithGoogle.user.id
        })
      } catch (e) {
        console.error('error on "finishe google login", ', e)
      } finally {
        self.view.openHomepage()
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
