import { Instance, types, getRoot } from 'mobx-state-tree'
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
      openSecretPage: () => (self.page = '/secret'),
      handleGoogleLoginSuccess() {
        const root: any = getRoot(self)
        root.finishGoogleLogin()
      }
    })),
  { page: window.location.pathname }
)

export interface ViewModelInterface extends Instance<typeof viewModel> {}

interface IRoutes {
  [routeName: string]: Function
}

// todo: DRY
const routeMap: (view: ViewModelInterface) => IRoutes = view => ({
  '/': view.openHomepage,
  '/register': view.openRegisterPage,
  '/login': () => view.openLoginPage(),
  '/secret': () => view.openSecretPage(),
  '/after-google-login': () => view.handleGoogleLoginSuccess()
})

function createRouterInner(routes: IRoutes) {
  const matchers: Array<[Function, Function]> = Object.keys(
    routes
  ).map(path => [route()(path), routes[path]])

  return function (path: string) {
    return matchers.some(([matcher, f]) => {
      const result = matcher(path)
      if (result === false) return false
      f(result)
      return true
    })
  }
}

const createRouter = (view: ViewModelInterface) =>
  createRouterInner(routeMap(view))

export { createRouter, viewModel as default }
