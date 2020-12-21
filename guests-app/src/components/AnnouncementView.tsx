import * as React from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { AnnouncementResponseModelType } from '../models'

export default function AnnouncementEdit({
  announcement
}: {
  announcement: AnnouncementResponseModelType
}) {
  return (
    <TableRow>
      <TableCell component="th" scope="row"></TableCell>
      <TableCell align="right">{announcement.subject}</TableCell>
      <TableCell align="right">{announcement.body}</TableCell>
      <TableCell align="right">{announcement.created_at}</TableCell>
    </TableRow>
  )
}
