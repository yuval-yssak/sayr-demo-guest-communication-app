import React from 'react'
import GoogleLogin from '../components/GoogleLogin'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'

const PaddedPaper = styled(Paper)`
  opacity: 0.95;
  padding: 20px;
`

const useStyles = makeStyles(theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

function ManualSignIn() {
  const classes = useStyles()

  return (
    // <Grid item></Grid>
    <>
      <Typography component="h1" variant="h5">
        Sign in manually
      </Typography>
      <form className={classes.form} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          style={{ marginBottom: '0' }}
        />
        <Typography align="left" style={{ marginLeft: '5px' }}>
          <Link href="#" variant="body2">
            Forgot password?
          </Link>
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign In
        </Button>
        <div style={{ padding: '20px 0 30px' }}>
          <Link href="#" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </div>
      </form>
    </>
  )
}

function Login() {
  return (
    <>
      <Box height="100vh" justifyContent="center" display="flex">
        <Grid container justify="center" style={{ margin: 'auto 0' }}>
          <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
            <PaddedPaper>
              <Typography variant="body1" paragraph>
                Join our community
              </Typography>
              <GoogleLogin onClick={() => {}} />
              <div style={{ marginTop: '8px', marginBottom: '8px' }}>or</div>
              <ManualSignIn />
              <Typography variant="caption">
                By joining, you agree to our{' '}
                <Link href="https://sivanandabahamas.org/terms-conditions/">
                  Terms and Privacy Policy
                </Link>
              </Typography>
            </PaddedPaper>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Login
