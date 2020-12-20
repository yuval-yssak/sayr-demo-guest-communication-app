import { RootStoreType } from './models'
import { reaction, autorun } from 'mobx'
import { GraphQLClient } from 'graphql-request'

export default function onStart(
  rootStore: RootStoreType,
  gqlHttpClient: GraphQLClient
) {
  // in case the user has just finished an OAuth login,
  // store the access token in the client and head to the homepage.
  if (window.location.pathname === '/after-google-login')
    rootStore.finishGoogleLogin()

  // whenever the view changes - push to browser history
  reaction(
    () => rootStore.view.currentURL,
    path => {
      if (window.location.pathname !== path)
        window.history.pushState(null, '', path)
    }
  )

  // handle page load - react to URL
  rootStore.view.setFromURL()
  if (window.location.pathname !== rootStore.view.currentURL)
    window.history.replaceState(null, '', rootStore.view.currentURL)

  // react to user manually navigating through history
  window.onpopstate = function historyChange(ev: PopStateEvent) {
    if (ev.type === 'popstate') rootStore.view.setFromURL()
  }

  // update authentication header for GraphQL whenever the access token updates.
  reaction(
    () => rootStore.loggedInUser?.accessToken,
    accessToken => {
      gqlHttpClient.setHeaders({
        authentication: accessToken ? `bearer ${accessToken}` : ''
      })
    }
  )

  // refresh token whenever it's 5 seconds away from being expired.
  autorun(() => {
    if (
      !rootStore.loggedInUser?.isTokenValidWithMargin(5000) &&
      rootStore.loggedInUser?.isOnline
    )
      rootStore.loggedInUser?.refreshToken()
  })

  // synchronize login and logout on all tabs
  // relying on the localStorageMixin to update the "loggedInUser"
  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key === 'mst-gql-rootstore') {
      const storageOldValue: RootStoreType = JSON.parse(e.oldValue || '{}')
      const storageNewValue: RootStoreType = JSON.parse(e.newValue || '{}')

      if (
        (storageOldValue?.loggedInUser &&
          !storageNewValue?.loggedInUser &&
          rootStore.loggedInUser) ||
        (!storageOldValue?.loggedInUser &&
          storageNewValue?.loggedInUser &&
          !rootStore.loggedInUser)
      ) {
        rootStore.setLoggedInUser(storageNewValue.loggedInUser)
      }
    }
  })

  rootStore.queryGuestsInHouse({}, s =>
    s.spiritual_name.first_name.last_name.room.program.email.headshotUrl.userData(
      u =>
        u.profilePhoto
          .invitationsSent(i => i.staffPersonId.timestamp)
          .subscriptions(s => s.userAgent).email.permissionLevel
    )
  )
  rootStore.queryUpcomingArrivals({ inUpcomingDays: 14 }, s =>
    s.spiritual_name.first_name.last_name.room.program.email.headshotUrl.userData(
      u =>
        u.profilePhoto
          .invitationsSent(i => i.staffPersonId.timestamp)
          .subscriptions(s => s.userAgent).email.permissionLevel
    )
  )

  rootStore.queryGetAllValidAnnouncements({})
}
