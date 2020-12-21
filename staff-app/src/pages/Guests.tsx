import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../models/reactUtils'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { PermissionLevel } from '../models'
import UserDeviceSubscription from '../components/UserDeviceSubscription'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles({
  root: {
    maxWidth: 345
  },
  media: {
    height: 140
  }
})

const FlexDiv = styled.div`
  display: flex;
`

function Guests() {
  const store = React.useContext(StoreContext)
  const classes = useStyles()

  return (
    <>
      <div>Guests List</div>
      <FlexDiv>
        <Grid container spacing={3}>
          {Array.from(store.registrationResponses.values()).map(reg => (
            <Grid item xs={12} md={6} lg={4} xl={3} key={reg.id}>
              <Card className={classes.root}>
                <CardActionArea>
                  <img
                    alt="person-profile"
                    style={{ float: 'right', width: '30%' }}
                    src={
                      reg.headshotUrl ||
                      reg.userData?.profilePhoto ||
                      'https://icon-library.com/images/blank-person-icon/blank-person-icon-29.jpg'
                    }
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {reg.spiritual_name ||
                        `${reg.first_name} ${reg.last_name}`}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      Room: {reg.room}
                      <br />
                      Registered:{' '}
                      {reg.userData ? (
                        <>
                          {reg.userData.permissionLevel ===
                          PermissionLevel.None ? (
                            <span>As a guest</span>
                          ) : (
                            <span>As staff</span>
                          )}
                        </>
                      ) : (
                        'No'
                      )}
                    </Typography>
                    {reg.userData && (
                      <>
                        <p>Devices: </p>
                        <TableContainer component={Paper}>
                          <Table aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                <TableCell>Device Type</TableCell>
                                <TableCell align="right">Brand</TableCell>
                                <TableCell align="right">Model</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {reg.userData.subscriptions?.map(s => (
                                <TableRow key={s.id}>
                                  <UserDeviceSubscription
                                    userAgent={s.userAgent || ''}
                                  />
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>{' '}
                      </>
                    )}
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  {!reg.userData && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() =>
                        store.mutateInviteUser({
                          email: reg.email!,
                          staff: store.loggedInUser!.id
                        })
                      }
                    >
                      Invite
                    </Button>
                  )}
                  {reg.userData?.permissionLevel === 'None' && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() =>
                        store.mutateUpdateUserPermission({
                          email: reg.email!,
                          permissionLevel: PermissionLevel.Staff
                        })
                      }
                    >
                      Register as staff
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </FlexDiv>
      <ul></ul>
    </>
  )
}

export default observer(Guests)
