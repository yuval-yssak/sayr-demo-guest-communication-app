import * as React from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { useForm } from 'react-hook-form'
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
import { useMst } from '../models/reactHook'
import { useQuery } from '../models/reactUtils'
import Error from '../components/Error'
import { observer } from 'mobx-react-lite'

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

function isPasswordStrong(password: string) {
  return new PasswordMeter().getResult(password).percent > 80
}

const InputValidationWarning = styled(Typography)`
  position: absolute;
  bottom: -12px;
  left: 2px;
  margin: 0;
  color: ${red[900]};
`

function InvalidEmailWarning() {
  return (
    <InputValidationWarning variant="body2">
      Email is not valid
    </InputValidationWarning>
  )
}

function PasswordsMismatchWarning() {
  return (
    <InputValidationWarning variant="body2">
      The passwords do not match
    </InputValidationWarning>
  )
}

const StyledEmailTextField = styled(TextField)`
  width: calc(100% - 48px);
`

function SignupEmailField({ inputRef }: { inputRef: any }) {
  return (
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
      inputRef={inputRef}
    />
  )
}

const StyledPasswordTextField = styled(TextField)`
  flex: 1;
`

function SignupPasswordField({
  passwordHidden,
  inputRef
}: {
  passwordHidden: boolean
  inputRef: any
}) {
  return (
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
      inputRef={inputRef}
    />
  )
}

function SignupRepeatPasswordField({
  passwordHidden,
  inputRef
}: {
  passwordHidden: boolean
  inputRef: any
}) {
  return (
    <StyledPasswordTextField
      variant="outlined"
      margin="normal"
      required
      name="repeatPassword"
      label="Repeat Password"
      type={passwordHidden ? 'password' : 'text'}
      id="signup-repeat-password"
      autoComplete="current-password"
      inputRef={inputRef}
    />
  )
}

const StyledFieldGrid = styled(Grid)`
  width: 100%;
  position: relative;
  margin-bottom: 1.5rem;
`

function ManualSignup() {
  const store = useMst()
  const { data, loading, error, setQuery } = useQuery(undefined, {
    fetchPolicy: 'no-cache' // not working for mutations :(
  })

  const {
    register,
    handleSubmit,
    errors,
    watch,
    formState: { dirtyFields }
  } = useForm<SignupInputs>({
    mode: 'onTouched'
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
            <form
              onSubmit={handleSubmit((data: SignupInputs): void => {
                setQuery(
                  store.mutateRegister({
                    email: data.signupEmail,
                    password: data.signupPassword
                  })
                )
              })}
            >
              <Grid
                container
                direction="column"
                justify="space-between"
                spacing={2}
              >
                <StyledFieldGrid item container>
                  <SignupEmailField
                    inputRef={register({
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
                    inputRef={register({
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
                    inputRef={register({
                      required: true,
                      validate: (value: string) => value === passwordWatch
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
                <Grid item>
                  {loading && <p>Registering...</p>}
                  {error && <Error error={error} />}
                  {data && (
                    <>
                      <p>Registered... {JSON.stringify(data)}</p>
                      <p>Check your email to verify the registration.</p>
                    </>
                  )}
                </Grid>
              </Grid>
            </form>
          </PaddedPaper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default observer(ManualSignup)
