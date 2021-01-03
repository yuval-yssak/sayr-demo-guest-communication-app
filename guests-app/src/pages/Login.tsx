import * as React from 'react'
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
import { useForm } from 'react-hook-form'
import * as EmailValidator from 'email-validator'
import Collapse from '@material-ui/core/Collapse'
import { PasswordMeter } from 'password-meter'
import LinearProgress from '@material-ui/core/LinearProgress'
import red from '@material-ui/core/colors/red'
import amber from '@material-ui/core/colors/amber'
import green from '@material-ui/core/colors/green'
import VisibilityIcon from '@material-ui/icons/Visibility'
import IconButton from '@material-ui/core/IconButton'

type Inputs = {
  email: string
  password: string
}

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
  const { register, handleSubmit, errors } = useForm<Inputs>({
    mode: 'onChange'
  })

  const [showSignup, setShowSignup] = React.useState(false)
  const classes = useStyles()
  function onSubmit(data: Inputs): void {
    console.log('submitting', data)
  }

  React.useEffect(() => {
    setTimeout(() => {
      if (showSignup)
        document
          .getElementById('signup-email')
          ?.scrollIntoView({ behavior: 'smooth' })
    }, 400)
  }, [showSignup])

  return (
    <>
      <Typography component="h1" variant="h5">
        Sign in manually
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          inputRef={register({
            required: true,
            validate: (value: string) => EmailValidator.validate(value)
          })}
        />
        {errors.email && <p>error: email is not valid</p>}
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
          inputRef={register({ required: true })}
        />
        {errors.password && <p>error: {errors.password.message}</p>}
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
          <Link
            onClick={() => {
              setShowSignup(true)
            }}
            variant="body2"
          >
            {"Don't have an account? Sign Up"}
          </Link>
        </div>
      </form>
      <Collapse in={showSignup}>
        <Signup />
      </Collapse>
    </>
  )
}

function Signup() {
  type SignupInputs = {
    signupEmail: string
    signupPassword: string
    repeatPassword: string
  }

  const { register, handleSubmit, errors, watch } = useForm<SignupInputs>({
    mode: 'onChange'
  })

  const [passwordHidden, setPasswordHidden] = React.useState(true)
  const [repeatPasswordHidden, setRepeatPasswordHidden] = React.useState(true)

  const passwordWatch = watch('signupPassword', '')
  function signupSubmit(data: SignupInputs): void {
    console.log('submitting signup form', data)
  }

  function isPasswordStrong() {
    return new PasswordMeter().getResult(passwordWatch).percent > 80
  }

  return (
    <div style={{ textAlign: 'left', marginTop: '16px' }}>
      <form onSubmit={handleSubmit(signupSubmit)}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="signup-email"
          label="Email Address"
          name="signupEmail"
          type="email"
          autoComplete="email"
          autoFocus
          style={{ width: '90%' }}
          inputRef={register({
            required: true,
            validate: (value: string) => EmailValidator.validate(value)
          })}
        />
        {errors.signupEmail && <p>error: email is not valid</p>}
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              aria-describedby="password-strength-progress"
              name="signupPassword"
              label="Password"
              type={passwordHidden ? 'password' : 'text'}
              id="signup-password"
              style={{ marginBottom: '0', marginTop: '0' }}
              autoComplete="current-password"
              inputRef={register({
                required: true,
                validate: () => isPasswordStrong()
              })}
            />
            <PasswordStrengthMeter password={passwordWatch} />
          </div>
          <IconButton
            aria-label="show password"
            onMouseDown={() => {
              setPasswordHidden(false)
            }}
            onMouseUp={() => {
              setPasswordHidden(true)
            }}
            onKeyDown={() => {
              setPasswordHidden(false)
            }}
            onKeyUp={() => {
              setPasswordHidden(true)
            }}
            onBlur={() => {
              setPasswordHidden(true)
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </div>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="repeatPassword"
          label="Repeat Password"
          type={repeatPasswordHidden ? 'password' : 'text'}
          id="signup-repeat-password"
          autoComplete="current-password"
          style={{ marginBottom: '0', width: '90%' }}
          inputRef={register({
            required: true,
            validate: (value: string) =>
              value === passwordWatch || 'the passwords do not match'
          })}
        />
        <IconButton
          onMouseDown={() => {
            setRepeatPasswordHidden(false)
          }}
          onMouseUp={() => {
            setRepeatPasswordHidden(true)
          }}
          onKeyDown={() => {
            setRepeatPasswordHidden(false)
          }}
          onKeyUp={() => {
            setRepeatPasswordHidden(true)
          }}
        >
          <VisibilityIcon />
        </IconButton>
        {errors.repeatPassword && <p>error: {errors.repeatPassword.message}</p>}

        <Button type="submit" fullWidth variant="contained" color="primary">
          Sign Up
        </Button>
      </form>
    </div>
  )
}

const LinearProgressWithStages = styled(LinearProgress)`
  width: 80%;

  & div {
    background-color: ${(props: { value: number }) =>
      props.value < 30 ? red[600] : props.value < 80 ? amber[900] : green[800]};
  }
`

const StyledPasswordMeterDiv = styled.div`
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & p {
    float: 'right';
    margin: 0;
    color: ${(props: { value: number }) =>
      props.value < 30 ? red[600] : props.value < 80 ? amber[900] : green[800]};
  }
`

function PasswordStrengthMeter({ password }: { password: string }) {
  const result = new PasswordMeter().getResult(password)

  return (
    <StyledPasswordMeterDiv value={result.percent}>
      <LinearProgressWithStages
        id="password-strength-progress"
        variant="determinate"
        value={result.percent}
      />
      <p>{result.status === 'veryStrong' ? 'very strong' : result.status}</p>
    </StyledPasswordMeterDiv>
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
