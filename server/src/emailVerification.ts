import { setApiKey, send } from '@sendgrid/mail'
import { ObjectId } from 'mongodb'
import { email } from '../config/config'

setApiKey(email.sendGridAPI)

const requestEmailVerification: (email: string, requestID: ObjectId) => void = (
  email,
  requestID
) => {
  const msg = {
    to: email,
    from: 'iswara@sivananda.org',
    subject: `Authenticate ${email} for Authentication Demo`,
    text: 'and easy to do anywhere, even with Node.js',
    html: `<p>Welcome to the authentication demo.</p><a href="http://localhost:4000/verify-email/${requestID}">Click here to verify your email address</a>`
  }

  send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch(error => {
      console.error(error)
    })
}

export default requestEmailVerification
