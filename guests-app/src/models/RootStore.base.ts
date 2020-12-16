/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { ObservableMap } from 'mobx'
import { types } from 'mobx-state-tree'
import {
  MSTGQLStore,
  configureStoreMixin,
  QueryOptions,
  withTypedRefs
} from 'mst-gql'

import { UserModel, UserModelType } from './UserModel'
import { userModelPrimitives, UserModelSelector } from './UserModel.base'
import { EventModel, EventModelType } from './EventModel'
import { eventModelPrimitives, EventModelSelector } from './EventModel.base'
import {
  LoginResponseModel,
  LoginResponseModelType
} from './LoginResponseModel'
import {
  loginResponseModelPrimitives,
  LoginResponseModelSelector
} from './LoginResponseModel.base'

/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  users: ObservableMap<string, UserModelType>
}

/**
 * Enums for the names of base graphql actions
 */
export enum RootStoreBaseQueries {
  queryUsers = 'queryUsers',
  queryTellASecret = 'queryTellASecret',
  queryGetEvents = 'queryGetEvents'
}
export enum RootStoreBaseMutations {
  mutateRegister = 'mutateRegister',
  mutateLogin = 'mutateLogin',
  mutateLogout = 'mutateLogout',
  mutateFinishLoginWithGoogle = 'mutateFinishLoginWithGoogle',
  mutateRevokeRefreshTokensForUser = 'mutateRevokeRefreshTokensForUser'
}

/**
 * Store, managing, among others, all the objects received through graphQL
 */
export const RootStoreBase = withTypedRefs<Refs>()(
  MSTGQLStore.named('RootStore')
    .extend(
      configureStoreMixin(
        [
          ['User', () => UserModel],
          ['Event', () => EventModel],
          ['LoginResponse', () => LoginResponseModel]
        ],
        ['User'],
        'js'
      )
    )
    .props({
      users: types.optional(types.map(types.late((): any => UserModel)), {})
    })
    .actions(self => ({
      queryUsers(
        variables?: {},
        resultSelector:
          | string
          | ((
              qb: UserModelSelector
            ) => UserModelSelector) = userModelPrimitives.toString(),
        options: QueryOptions = {}
      ) {
        return self.query<{ users: UserModelType[] }>(
          `query users { users {
        ${
          typeof resultSelector === 'function'
            ? resultSelector(new UserModelSelector()).toString()
            : resultSelector
        }
      } }`,
          variables,
          options
        )
      },
      queryTellASecret(variables?: {}, options: QueryOptions = {}) {
        return self.query<{ tellASecret: string }>(
          `query tellASecret { tellASecret }`,
          variables,
          options
        )
      },
      queryGetEvents(
        variables?: {},
        resultSelector:
          | string
          | ((
              qb: EventModelSelector
            ) => EventModelSelector) = eventModelPrimitives.toString(),
        options: QueryOptions = {}
      ) {
        return self.query<{ getEvents: EventModelType[] }>(
          `query getEvents { getEvents {
        ${
          typeof resultSelector === 'function'
            ? resultSelector(new EventModelSelector()).toString()
            : resultSelector
        }
      } }`,
          variables,
          options
        )
      },
      mutateRegister(
        variables: { password: string; email: string },
        optimisticUpdate?: () => void
      ) {
        return self.mutate<{ register: boolean }>(
          `mutation register($password: String!, $email: String!) { register(password: $password, email: $email) }`,
          variables,
          optimisticUpdate
        )
      },
      mutateLogin(
        variables: { password: string; email: string },
        resultSelector:
          | string
          | ((
              qb: LoginResponseModelSelector
            ) => LoginResponseModelSelector) = loginResponseModelPrimitives.toString(),
        optimisticUpdate?: () => void
      ) {
        return self.mutate<{ login: LoginResponseModelType }>(
          `mutation login($password: String!, $email: String!) { login(password: $password, email: $email) {
        ${
          typeof resultSelector === 'function'
            ? resultSelector(new LoginResponseModelSelector()).toString()
            : resultSelector
        }
      } }`,
          variables,
          optimisticUpdate
        )
      },
      mutateLogout(variables?: {}, optimisticUpdate?: () => void) {
        return self.mutate<{ logout: boolean }>(
          `mutation logout { logout }`,
          variables,
          optimisticUpdate
        )
      },
      mutateFinishLoginWithGoogle(
        variables?: {},
        resultSelector:
          | string
          | ((
              qb: LoginResponseModelSelector
            ) => LoginResponseModelSelector) = loginResponseModelPrimitives.toString(),
        optimisticUpdate?: () => void
      ) {
        return self.mutate<{ finishLoginWithGoogle: LoginResponseModelType }>(
          `mutation finishLoginWithGoogle { finishLoginWithGoogle {
        ${
          typeof resultSelector === 'function'
            ? resultSelector(new LoginResponseModelSelector()).toString()
            : resultSelector
        }
      } }`,
          variables,
          optimisticUpdate
        )
      },
      mutateRevokeRefreshTokensForUser(
        variables: { userId: string },
        optimisticUpdate?: () => void
      ) {
        return self.mutate<{ revokeRefreshTokensForUser: boolean }>(
          `mutation revokeRefreshTokensForUser($userId: ID!) { revokeRefreshTokensForUser(userId: $userId) }`,
          variables,
          optimisticUpdate
        )
      }
    }))
)
