import { types, getParent } from 'mobx-state-tree'
import { RootStoreType } from './RootStore'
// @ts-ignore
import route from 'path-match'

const viewModel = types.optional(
  types
    .model({
      page: '',
      id: types.maybeNull(types.number)
    })
    .views(self => ({
      get currentURL() {
        switch (self.page) {
          case '':
          case '/':
            return '/'
          case '/register':
            return '/register'
          case '/login':
            return '/login'
          default:
            return self.page
          // return '/404'
        }
      }
    }))
    .actions(self => ({
      openHomepage: () => (self.page = '/'),
      openRegisterPage: () => (self.page = '/register'),
      openLoginPage: () => (self.page = '/login'),
      openSecretPage: () => (self.page = '/secret')
    })),
  { page: window.location.pathname }
)

interface IRoutes {
  [routeName: string]: Function
}

// todo: DRY
const routeMap: (view: any) => IRoutes = view => ({
  '/': view.openHomepage,
  '/register': view.openRegisterPage,
  '/login': () => view.openLoginPage(),
  '/secret': () => view.openSecretPage()
})

function createRouter(routes: IRoutes) {
  const matchers = Object.keys(routes).map(path => [
    route()(path),
    routes[path]
  ])
  return function (path: string) {
    return matchers.some(([matcher, f]) => {
      const result = matcher(path)
      if (result === false) return false
      f(result)
      return true
    })
  }
}

export { routeMap, createRouter, viewModel as default }
