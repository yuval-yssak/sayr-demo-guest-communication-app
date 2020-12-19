import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../models/reactUtils'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { PermissionLevel } from '../models'

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

const StyledPaper = styled(Paper)`
  padding: 2;
  text-align: center;
  color: lightgray;
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
                      {reg.userData
                        ? reg.userData.permissionLevel === 'None'
                          ? 'As a guest'
                          : 'As staff'
                        : 'No'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  {!reg.userData && (
                    <Button size="small" color="primary">
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
