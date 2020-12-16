import { Instance } from 'mobx-state-tree'
import { RecipientModelBase } from './RecipientModel.base'

/* The TypeScript type of an instance of RecipientModel */
export interface RecipientModelType
  extends Instance<typeof RecipientModel.Type> {}

/* A graphql query fragment builders for RecipientModel */
export {
  selectFromRecipient,
  recipientModelPrimitives,
  RecipientModelSelector
} from './RecipientModel.base'

/**
 * RecipientModel
 */
export const RecipientModel = RecipientModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self))
  }
}))
