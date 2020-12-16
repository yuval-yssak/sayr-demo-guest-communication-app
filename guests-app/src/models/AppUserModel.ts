import { Instance } from 'mobx-state-tree'
import { AppUserModelBase } from './AppUserModel.base'

/* The TypeScript type of an instance of AppUserModel */
export interface AppUserModelType extends Instance<typeof AppUserModel.Type> {}

/* A graphql query fragment builders for AppUserModel */
export {
  selectFromAppUser,
  appUserModelPrimitives,
  AppUserModelSelector
} from './AppUserModel.base'

/**
 * AppUserModel
 */
export const AppUserModel = AppUserModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self))
  }
}))
