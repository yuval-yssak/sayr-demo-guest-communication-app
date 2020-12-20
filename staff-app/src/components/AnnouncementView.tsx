import * as React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import CreateIcon from '@material-ui/icons/Create'
import { AnnouncementResponseModelType } from '../models'
import { StoreContext } from '../models/reactUtils'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'

export default function AnnouncementEdit({
  announcement
}: {
  announcement: AnnouncementResponseModelType
}) {
  const store = React.useContext(StoreContext)

  return (
    <TableRow>
      <TableCell component="th" scope="row"></TableCell>
      <TableCell align="right">{announcement.subject}</TableCell>
      <TableCell align="right">{announcement.body}</TableCell>
      <TableCell align="right">{announcement.created_at}</TableCell>
      <TableCell align="right">{announcement.updated_at}</TableCell>
      <TableCell>
        <IconButton
          onClick={() =>
            store.mutateCreateNotificationsForAnnouncement({
              announcementId: announcement.id,
              persons: Array.from(store.registrationResponses.values())
                .map(r => ({ id: r.userData?.id }))
                .filter(r => r.id)
            })
          }
        >
          <NotificationsActiveIcon />
        </IconButton>
        <IconButton
          aria-label="update"
          onClick={() => {
            const answer = window.prompt(
              "Are you sure you want to invalidate this announcement? If so: type in 'yes'"
            )
            if (answer?.match(/yes/i)) announcement.setInvalid()
          }}
        >
          <CreateIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}
