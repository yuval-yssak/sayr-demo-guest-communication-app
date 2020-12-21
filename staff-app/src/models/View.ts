import { Instance, types } from 'mobx-state-tree'
import { match, compile } from 'path-to-regexp'

export interface IView extends Instance<typeof View> {}

type IPageWithId = { id: string }
const viewModel = types
  .model('View', {
    page: types.union(
      types.literal(''),
      types.literal('/'),
      types.literal('/login'),
      types.literal('/register'),
      types.literal('/guests'),
      types.literal('/announcements'),
      types.literal('/custom')
    ),
    id: types.maybe(types.string)
  })
  .views(self => ({
    get currentURL() {
      console.log('getting url', self.page)
      switch (self.page) {
        case '':
        case '/':
          return '/'
        case '/custom':
          const toPath = compile<IPageWithId>('/custom/:id')
          return toPath({ id: self.id || '' })
        default:
          return self.page
      }
    }
  }))

  .actions(self => ({
    openHomePage() {
      self.page = '/'
      self.id = undefined
    },
    openCustomPage(id: string) {
      self.page = '/custom'
      self.id = id
    },
    openLoginPage: () => (self.page = '/login'),
    openRegisterPage: () => (self.page = '/register'),
    openGuestsPage: () => (self.page = '/guests'),
    openAnnouncementsPage: () => (self.page = '/announcements'),
    setFromURL() {
      const newView = getViewFromURL() as Instance<typeof viewModel>
      console.log('setting from url', window.location.pathname, newView.page)
      self.page = newView.page
      self.id = newView.id
    }
  }))

export const View = types.optional(
  viewModel,
  getViewFromURL() as Instance<typeof viewModel>
)

function getViewFromURL() {
  console.log('get view from url')

  const { pathname } = window.location
  const matchCustom = match<IPageWithId>('/custom/:id')
  const matchedCustom = matchCustom(pathname)

  if (matchedCustom) return { page: 'custom', id: matchedCustom.params.id }

  const matchGeneral = match('/:page')
  const matchedGeneral = matchGeneral(pathname)

  if (matchedGeneral)
    switch (matchedGeneral.path) {
      case '':
      case '/':
        return { page: '/' }
      case '/login':
      case '/register':
      case '/guests':
      case '/announcements':
        return { page: matchedGeneral.path }
      default:
        return { page: '/' }
    }
  else return { page: '/' }
}
