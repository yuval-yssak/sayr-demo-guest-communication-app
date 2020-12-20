import { getRoot, Instance } from 'mobx-state-tree'
import { AnnouncementResponseModelBase } from './AnnouncementResponseModel.base'

/* The TypeScript type of an instance of AnnouncementResponseModel */
export interface AnnouncementResponseModelType
  extends Instance<typeof AnnouncementResponseModel.Type> {}

/* A graphql query fragment builders for AnnouncementResponseModel */
export {
  selectFromAnnouncementResponse,
  announcementResponseModelPrimitives,
  AnnouncementResponseModelSelector
} from './AnnouncementResponseModel.base'

/**
 * AnnouncementResponseModel
 */
export const AnnouncementResponseModel = AnnouncementResponseModelBase.actions(
  self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    },
    setInvalid() {
      ;(getRoot(self) as any).mutateInvalidateAnnouncement({ id: self.id })

      self.valid = false
    }
  })
)
