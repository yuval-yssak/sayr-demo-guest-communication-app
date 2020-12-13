import { Instance, types, getRoot } from 'mobx-state-tree'
import route from 'path-match'

/* The TypeScript type of an instance of ViewModel */
export interface ViewModelType extends Instance<typeof ViewModel.Type> {}

const ViewModel = types.optional(
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
      openSecretPage: () => (self.page = '/secret'),
      handleGoogleLoginSuccess() {
        getRoot<any>(self).finishGoogleLogin()
      }
    })),
  { page: window.location.pathname }
)

interface IRoutes {
  [routeName: string]: Function
}

// todo: DRY
const routeMap: (view: ViewModelType) => IRoutes = view => ({
  '/': view.openHomepage,
  '/register': view.openRegisterPage,
  '/login': () => view.openLoginPage(),
  '/secret': () => view.openSecretPage(),
  '/after-google-login': () => view.handleGoogleLoginSuccess()
})

function createRouterInner(routes: IRoutes) {
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

const createRouter = (view: ViewModelType) => createRouterInner(routeMap(view))

export { createRouter, ViewModel as default }
