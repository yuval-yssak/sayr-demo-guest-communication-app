/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum PermissionLevel {
  None="None",
Staff="Staff",
Manager="Manager",
Admin="Admin"
}

/**
* PermissionLevel
*/
export const PermissionLevelEnumType = types.enumeration("PermissionLevel", [
        "None",
  "Staff",
  "Manager",
  "Admin",
      ])
