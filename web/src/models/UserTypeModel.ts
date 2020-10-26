import { Instance } from "mobx-state-tree"
import { UserTypeModelBase } from "./UserTypeModel.base"

/* The TypeScript type of an instance of UserTypeModel */
export interface UserTypeModelType extends Instance<typeof UserTypeModel.Type> {}

/* A graphql query fragment builders for UserTypeModel */
export { selectFromUserType, userTypeModelPrimitives, UserTypeModelSelector } from "./UserTypeModel.base"

/**
 * UserTypeModel
 */
export const UserTypeModel = UserTypeModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
