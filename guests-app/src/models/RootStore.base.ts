/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { ObservableMap } from "mobx"
import { types } from "mobx-state-tree"
import { MSTGQLStore, configureStoreMixin, QueryOptions, withTypedRefs } from "mst-gql"

import { AppUserModel, AppUserModelType } from "./AppUserModel"
import { appUserModelPrimitives, AppUserModelSelector } from "./AppUserModel.base"
import { InvitationModel, InvitationModelType } from "./InvitationModel"
import { invitationModelPrimitives, InvitationModelSelector } from "./InvitationModel.base"
import { NotificationSubscriptionModel, NotificationSubscriptionModelType } from "./NotificationSubscriptionModel"
import { notificationSubscriptionModelPrimitives, NotificationSubscriptionModelSelector } from "./NotificationSubscriptionModel.base"
import { RegistrationResponseModel, RegistrationResponseModelType } from "./RegistrationResponseModel"
import { registrationResponseModelPrimitives, RegistrationResponseModelSelector } from "./RegistrationResponseModel.base"
import { AnnouncementResponseModel, AnnouncementResponseModelType } from "./AnnouncementResponseModel"
import { announcementResponseModelPrimitives, AnnouncementResponseModelSelector } from "./AnnouncementResponseModel.base"
import { LoginResponseModel, LoginResponseModelType } from "./LoginResponseModel"
import { loginResponseModelPrimitives, LoginResponseModelSelector } from "./LoginResponseModel.base"
import { NotificationResponseModel, NotificationResponseModelType } from "./NotificationResponseModel"
import { notificationResponseModelPrimitives, NotificationResponseModelSelector } from "./NotificationResponseModel.base"
import { RecipientModel, RecipientModelType } from "./RecipientModel"
import { recipientModelPrimitives, RecipientModelSelector } from "./RecipientModel.base"
import { DeviceModel, DeviceModelType } from "./DeviceModel"
import { deviceModelPrimitives, DeviceModelSelector } from "./DeviceModel.base"


import { PermissionLevel } from "./PermissionLevelEnum"

export type PersonInput = {
  id: number
}
/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  appUsers: ObservableMap<string, AppUserModelType>
}


/**
* Enums for the names of base graphql actions
*/
export enum RootStoreBaseQueries {
queryUsers="queryUsers",
queryTellASecret="queryTellASecret",
queryGuestsInHouse="queryGuestsInHouse",
queryUpcomingArrivals="queryUpcomingArrivals",
queryGetAllValidAnnouncements="queryGetAllValidAnnouncements"
}
export enum RootStoreBaseMutations {
mutateRegister="mutateRegister",
mutateLogin="mutateLogin",
mutateLogout="mutateLogout",
mutateFinishLoginWithGoogle="mutateFinishLoginWithGoogle",
mutateRevokeRefreshTokensForUser="mutateRevokeRefreshTokensForUser",
mutateUpdateUserPermission="mutateUpdateUserPermission",
mutateAssociateUserWithPerson="mutateAssociateUserWithPerson",
mutateCreateUserSubscription="mutateCreateUserSubscription",
mutateCreateAnnouncement="mutateCreateAnnouncement",
mutateInvalidateAnnouncement="mutateInvalidateAnnouncement",
mutateCreateNotificationsForAnnouncement="mutateCreateNotificationsForAnnouncement"
}

/**
* Store, managing, among others, all the objects received through graphQL
*/
export const RootStoreBase = withTypedRefs<Refs>()(MSTGQLStore
  .named("RootStore")
  .extend(configureStoreMixin([['AppUser', () => AppUserModel], ['Invitation', () => InvitationModel], ['NotificationSubscription', () => NotificationSubscriptionModel], ['RegistrationResponse', () => RegistrationResponseModel], ['AnnouncementResponse', () => AnnouncementResponseModel], ['LoginResponse', () => LoginResponseModel], ['NotificationResponse', () => NotificationResponseModel], ['Recipient', () => RecipientModel], ['Device', () => DeviceModel]], ['AppUser'], "js"))
  .props({
    appUsers: types.optional(types.map(types.late((): any => AppUserModel)), {})
  })
  .actions(self => ({
    queryUsers(variables?: {  }, resultSelector: string | ((qb: AppUserModelSelector) => AppUserModelSelector) = appUserModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ users: AppUserModelType[]}>(`query users { users {
        ${typeof resultSelector === "function" ? resultSelector(new AppUserModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryTellASecret(variables?: {  }, options: QueryOptions = {}) {
      return self.query<{ tellASecret: string }>(`query tellASecret { tellASecret }`, variables, options)
    },
    queryGuestsInHouse(variables?: {  }, resultSelector: string | ((qb: RegistrationResponseModelSelector) => RegistrationResponseModelSelector) = registrationResponseModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ guestsInHouse: RegistrationResponseModelType[]}>(`query guestsInHouse { guestsInHouse {
        ${typeof resultSelector === "function" ? resultSelector(new RegistrationResponseModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryUpcomingArrivals(variables: { inUpcomingDays?: number }, resultSelector: string | ((qb: RegistrationResponseModelSelector) => RegistrationResponseModelSelector) = registrationResponseModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ upcomingArrivals: RegistrationResponseModelType[]}>(`query upcomingArrivals($inUpcomingDays: Float) { upcomingArrivals(inUpcomingDays: $inUpcomingDays) {
        ${typeof resultSelector === "function" ? resultSelector(new RegistrationResponseModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryGetAllValidAnnouncements(variables?: {  }, resultSelector: string | ((qb: AnnouncementResponseModelSelector) => AnnouncementResponseModelSelector) = announcementResponseModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ getAllValidAnnouncements: AnnouncementResponseModelType[]}>(`query getAllValidAnnouncements { getAllValidAnnouncements {
        ${typeof resultSelector === "function" ? resultSelector(new AnnouncementResponseModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    mutateRegister(variables: { password: string, email: string }, optimisticUpdate?: () => void) {
      return self.mutate<{ register: boolean }>(`mutation register($password: String!, $email: String!) { register(password: $password, email: $email) }`, variables, optimisticUpdate)
    },
    mutateLogin(variables: { password: string, email: string }, resultSelector: string | ((qb: LoginResponseModelSelector) => LoginResponseModelSelector) = loginResponseModelPrimitives.toString(), optimisticUpdate?: () => void) {
      return self.mutate<{ login: LoginResponseModelType}>(`mutation login($password: String!, $email: String!) { login(password: $password, email: $email) {
        ${typeof resultSelector === "function" ? resultSelector(new LoginResponseModelSelector()).toString() : resultSelector}
      } }`, variables, optimisticUpdate)
    },
    mutateLogout(variables?: {  }, optimisticUpdate?: () => void) {
      return self.mutate<{ logout: boolean }>(`mutation logout { logout }`, variables, optimisticUpdate)
    },
    mutateFinishLoginWithGoogle(variables?: {  }, resultSelector: string | ((qb: LoginResponseModelSelector) => LoginResponseModelSelector) = loginResponseModelPrimitives.toString(), optimisticUpdate?: () => void) {
      return self.mutate<{ finishLoginWithGoogle: LoginResponseModelType}>(`mutation finishLoginWithGoogle { finishLoginWithGoogle {
        ${typeof resultSelector === "function" ? resultSelector(new LoginResponseModelSelector()).toString() : resultSelector}
      } }`, variables, optimisticUpdate)
    },
    mutateRevokeRefreshTokensForUser(variables: { userId: string }, optimisticUpdate?: () => void) {
      return self.mutate<{ revokeRefreshTokensForUser: boolean }>(`mutation revokeRefreshTokensForUser($userId: String!) { revokeRefreshTokensForUser(userId: $userId) }`, variables, optimisticUpdate)
    },
    mutateUpdateUserPermission(variables: { permissionLevel: PermissionLevel, personId: number }, optimisticUpdate?: () => void) {
      return self.mutate<{ updateUserPermission: boolean }>(`mutation updateUserPermission($permissionLevel: PermissionLevel!, $personId: Float!) { updateUserPermission(permissionLevel: $permissionLevel, personId: $personId) }`, variables, optimisticUpdate)
    },
    mutateAssociateUserWithPerson(variables: { personId: number, userId: string }, optimisticUpdate?: () => void) {
      return self.mutate<{ associateUserWithPerson: boolean }>(`mutation associateUserWithPerson($personId: Float!, $userId: String!) { associateUserWithPerson(personId: $personId, userId: $userId) }`, variables, optimisticUpdate)
    },
    mutateCreateUserSubscription(variables: { authKey: string, p256DhKey: string, endpoint: string, userAgent: string, userId: string }, optimisticUpdate?: () => void) {
      return self.mutate<{ createUserSubscription: boolean }>(`mutation createUserSubscription($authKey: String!, $p256DhKey: String!, $endpoint: String!, $userAgent: String!, $userId: String!) { createUserSubscription(authKey: $authKey, p256dhKey: $p256DhKey, endpoint: $endpoint, userAgent: $userAgent, userId: $userId) }`, variables, optimisticUpdate)
    },
    mutateCreateAnnouncement(variables: { image?: string, valid?: boolean, body: string, subject: string }, resultSelector: string | ((qb: AnnouncementResponseModelSelector) => AnnouncementResponseModelSelector) = announcementResponseModelPrimitives.toString(), optimisticUpdate?: () => void) {
      return self.mutate<{ createAnnouncement: AnnouncementResponseModelType}>(`mutation createAnnouncement($image: String, $valid: Boolean, $body: String!, $subject: String!) { createAnnouncement(image: $image, valid: $valid, body: $body, subject: $subject) {
        ${typeof resultSelector === "function" ? resultSelector(new AnnouncementResponseModelSelector()).toString() : resultSelector}
      } }`, variables, optimisticUpdate)
    },
    mutateInvalidateAnnouncement(variables: { id: string }, optimisticUpdate?: () => void) {
      return self.mutate<{ invalidateAnnouncement: boolean }>(`mutation invalidateAnnouncement($id: String!) { invalidateAnnouncement(_id: $id) }`, variables, optimisticUpdate)
    },
    mutateCreateNotificationsForAnnouncement(variables: { announcementId: string, persons: PersonInput[] }, resultSelector: string | ((qb: NotificationResponseModelSelector) => NotificationResponseModelSelector) = notificationResponseModelPrimitives.toString(), optimisticUpdate?: () => void) {
      return self.mutate<{ createNotificationsForAnnouncement: NotificationResponseModelType[]}>(`mutation createNotificationsForAnnouncement($announcementId: String!, $persons: [PersonInput!]!) { createNotificationsForAnnouncement(announcementID: $announcementId, persons: $persons) {
        ${typeof resultSelector === "function" ? resultSelector(new NotificationResponseModelSelector()).toString() : resultSelector}
      } }`, variables, optimisticUpdate)
    },
  })))
