import { Instance } from 'mobx-state-tree'
import { InvitationModelBase } from './InvitationModel.base'

/* The TypeScript type of an instance of InvitationModel */
export interface InvitationModelType
  extends Instance<typeof InvitationModel.Type> {}

/* A graphql query fragment builders for InvitationModel */
export {
  selectFromInvitation,
  invitationModelPrimitives,
  InvitationModelSelector
} from './InvitationModel.base'

/**
 * InvitationModel
 */
export const InvitationModel = InvitationModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self))
  }
}))
