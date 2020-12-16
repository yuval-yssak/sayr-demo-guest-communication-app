/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * InvitationBase
 * auto generated base class for the model InvitationModel.
 */
export const InvitationModelBase = ModelBase
  .named('Invitation')
  .props({
    __typename: types.optional(types.literal("Invitation"), "Invitation"),
    timestamp: types.union(types.undefined, types.frozen()),
    staffPersonId: types.union(types.undefined, types.number),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class InvitationModelSelector extends QueryBuilder {
  get timestamp() { return this.__attr(`timestamp`) }
  get staffPersonId() { return this.__attr(`staffPersonId`) }
}
export function selectFromInvitation() {
  return new InvitationModelSelector()
}

export const invitationModelPrimitives = selectFromInvitation().timestamp.staffPersonId
