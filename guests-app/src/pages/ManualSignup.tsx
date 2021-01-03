import * as React from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { useForm, Ref } from 'react-hook-form'
import * as EmailValidator from 'email-validator'
import { PasswordMeter } from 'password-meter'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import PaddedPaper from '../components/common/PaddedPaper'

import styled from 'styled-components'
import red from '@material-ui/core/colors/red'
import VisibilityIcon from '@material-ui/icons/Visibility'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import PasswordStrengthMeter from '../components/Signup/PasswordStrengthMeter'

// IconButton which enables showing the password for improved accessibility
function ShowPasswordIcon({
  callback
}: {
  callback: (hidden: boolean) => void
}) {
  return (
    <IconButton
      aria-label="show password"
      onMouseDown={() => {
        callback(false)
      }}
      onMouseUp={() => {
        callback(true)
      }}
      onKeyDown={() => {
        callback(false)
      }}
      onKeyUp={() => {
        callback(true)
      }}
      onBlur={() => {
        callback(true)
      }}
    >
      <VisibilityIcon />
    </IconButton>
  )
}

type SignupInputs = {
  signupEmail: string
  signupPassword: string
  repeatPassword: string
}

function signupSubmit(data: SignupInputs): void {
  console.log('submitting signup form', data)
}

function isPasswordStrong(password: string) {
  return new PasswordMeter().getResult(password).percent > 80
}

const StyledInvalidEmailWarning = styled(Typography)`
  position: absolute;
  bottom: -12px;
  left: 2px;
  margin: 0;
  color: ${red[900]};
`

function InvalidEmailWarning() {
  return (
    <StyledInvalidEmailWarning variant="body2">
      Email is not valid
    </StyledInvalidEmailWarning>
  )
}

function PasswordsMismatchWarning() {
  return (
    <StyledInvalidEmailWarning variant="body2">
      The passwords do not match
    </StyledInvalidEmailWarning>
  )
}

const StyledEmailTextField = styled(TextField)`
  width: calc(100% - 48px);
`

const SignupEmailField = React.forwardRef((_props, ref) => (
  <StyledEmailTextField
    variant="outlined"
    margin="normal"
    required
    id="signup-email"
    label="Email Address"
    name="signupEmail"
    type="email"
    autoComplete="email"
    autoFocus
    inputRef={ref}
  />
))

const StyledPasswordTextField = styled(TextField)`
  flex: 1;
`

const SignupPasswordField = React.forwardRef<Ref, { passwordHidden: boolean }>(
  ({ passwordHidden }, ref) => (
    <StyledPasswordTextField
      variant="outlined"
      margin="normal"
      required
      aria-describedby="password-strength-progress"
      name="signupPassword"
      label="Password"
      type={passwordHidden ? 'password' : 'text'}
      id="signup-password"
      autoComplete="current-password"
      inputRef={ref}
    />
  )
)

const SignupRepeatPasswordField = React.forwardRef<
  Ref,
  { passwordHidden: boolean }
>(({ passwordHidden }, ref) => (
  <StyledPasswordTextField
    variant="outlined"
    margin="normal"
    required
    name="repeatPassword"
    label="Repeat Password"
    type={passwordHidden ? 'password' : 'text'}
    id="signup-repeat-password"
    autoComplete="current-password"
    inputRef={ref}
  />
))

const StyledFieldGrid = styled(Grid)`
  width: 100%;
  position: relative;
  margin-bottom: 1.5rem;
`

function ManualSignup() {
  const {
    register,
    handleSubmit,
    errors,
    watch,
    formState: { dirtyFields }
  } = useForm<SignupInputs>({
    mode: 'onChange'
  })

  const [passwordHidden, setPasswordHidden] = React.useState(true)
  const [repeatPasswordHidden, setRepeatPasswordHidden] = React.useState(true)

  const passwordWatch = watch('signupPassword', '')

  return (
    <Box height="100vh" justifyContent="center" display="flex">
      <Grid container justify="center" style={{ margin: 'auto 0' }}>
        <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
          <PaddedPaper>
            <Typography component="h1" variant="h5">
              Sivananda Bahamas Guests - Sign Up
            </Typography>
            <form onSubmit={handleSubmit(signupSubmit)}>
              <Grid
                container
                direction="column"
                justify="space-between"
                spacing={2}
              >
                <StyledFieldGrid item container>
                  <SignupEmailField
                    ref={register({
                      required: true,
                      validate: (value: string) =>
                        EmailValidator.validate(value)
                    })}
                  />
                  {errors.signupEmail && <InvalidEmailWarning />}
                </StyledFieldGrid>
                <StyledFieldGrid item container>
                  <SignupPasswordField
                    passwordHidden={passwordHidden}
                    ref={register({
                      required: true,
                      validate: () => isPasswordStrong(passwordWatch)
                    })}
                  />
                  <ShowPasswordIcon callback={setPasswordHidden} />
                  {dirtyFields.signupPassword && (
                    <PasswordStrengthMeter password={passwordWatch} />
                  )}
                </StyledFieldGrid>
                <StyledFieldGrid item container>
                  <SignupRepeatPasswordField
                    passwordHidden={repeatPasswordHidden}
                    ref={register({
                      required: true,
                      validate: (value: string) =>
                        value === passwordWatch || 'The passwords do not match'
                    })}
                  />
                  <ShowPasswordIcon callback={setRepeatPasswordHidden} />
                  {errors.repeatPassword && <PasswordsMismatchWarning />}
                </StyledFieldGrid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Sign Up
                </Button>
              </Grid>
            </form>
          </PaddedPaper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ManualSignup
