import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../models/reactUtils'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import AnnouncementView from '../components/AnnouncementView'

function Announcements() {
  const store = React.useContext(StoreContext)
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="announcements-table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right">Subject</TableCell>
              <TableCell align="right">Body</TableCell>
              <TableCell align="right">Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(store.announcementResponses.values())
              .filter(announcement => announcement.valid)
              .map(announcement => (
                <React.Fragment key={announcement.id}>
                  <AnnouncementView announcement={announcement} />
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default observer(Announcements)
