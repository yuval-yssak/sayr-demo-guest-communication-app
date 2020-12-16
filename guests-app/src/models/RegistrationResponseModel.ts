import { Instance } from 'mobx-state-tree'
import { RegistrationResponseModelBase } from './RegistrationResponseModel.base'

/* The TypeScript type of an instance of RegistrationResponseModel */
export interface RegistrationResponseModelType
  extends Instance<typeof RegistrationResponseModel.Type> {}

/* A graphql query fragment builders for RegistrationResponseModel */
export {
  selectFromRegistrationResponse,
  registrationResponseModelPrimitives,
  RegistrationResponseModelSelector
} from './RegistrationResponseModel.base'

/**
 * RegistrationResponseModel
 */
export const RegistrationResponseModel = RegistrationResponseModelBase.actions(
  self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  })
)
