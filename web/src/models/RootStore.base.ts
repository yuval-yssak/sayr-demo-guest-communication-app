/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { ObservableMap } from "mobx"
import { types } from "mobx-state-tree"
import { MSTGQLStore, configureStoreMixin, QueryOptions, withTypedRefs } from "mst-gql"

import { LoginResponseModel, LoginResponseModelType } from "./LoginResponseModel"
import { loginResponseModelPrimitives, LoginResponseModelSelector } from "./LoginResponseModel.base"



/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {

}


/**
* Enums for the names of base graphql actions
*/
export enum RootStoreBaseQueries {
queryHello="queryHello",
queryTellASecret="queryTellASecret"
}
export enum RootStoreBaseMutations {
mutateRegister="mutateRegister",
mutateLogin="mutateLogin",
mutateRevokeRefreshTokensForUser="mutateRevokeRefreshTokensForUser"
}

/**
* Store, managing, among others, all the objects received through graphQL
*/
export const RootStoreBase = withTypedRefs<Refs>()(MSTGQLStore
  .named("RootStore")
  .extend(configureStoreMixin([['LoginResponse', () => LoginResponseModel]], [], "js"))
  .props({

  })
  .actions(self => ({
    queryHello(variables?: {  }, options: QueryOptions = {}) {
      return self.query<{ hello: string }>(`query hello { hello }`, variables, options)
    },
    queryTellASecret(variables?: {  }, options: QueryOptions = {}) {
      return self.query<{ tellASecret: string }>(`query tellASecret { tellASecret }`, variables, options)
    },
    mutateRegister(variables: { password: string, email: string }, optimisticUpdate?: () => void) {
      return self.mutate<{ register: boolean }>(`mutation register($password: String!, $email: String!) { register(password: $password, email: $email) }`, variables, optimisticUpdate)
    },
    mutateLogin(variables: { password: string, email: string }, resultSelector: string | ((qb: LoginResponseModelSelector) => LoginResponseModelSelector) = loginResponseModelPrimitives.toString(), optimisticUpdate?: () => void) {
      return self.mutate<{ login: LoginResponseModelType}>(`mutation login($password: String!, $email: String!) { login(password: $password, email: $email) {
        ${typeof resultSelector === "function" ? resultSelector(new LoginResponseModelSelector()).toString() : resultSelector}
      } }`, variables, optimisticUpdate)
    },
    mutateRevokeRefreshTokensForUser(variables: { userId: string }, optimisticUpdate?: () => void) {
      return self.mutate<{ revokeRefreshTokensForUser: boolean }>(`mutation revokeRefreshTokensForUser($userId: ID!) { revokeRefreshTokensForUser(userId: $userId) }`, variables, optimisticUpdate)
    },
  })))
