import { ObjectId } from 'mongodb'

async function requestEmailVerification(
  email: string,
  requestID: ObjectId,
  app: 'guest-app' | 'staff-app'
): Promise<void> {
  const msg = {
    to: email,
    from: 'iswara@sivananda.org',
    subject: `Authenticate ${email} for Authentication Demo`,
    text: 'and easy to do anywhere, even with Node.js',
    html: `<p>Welcome to the authentication demo.</p><a href="${process.env.SERVER_BASE_URL}/${app}/verify-email/${requestID}">Click here to verify your email address</a>`
  }

  console.log('Email not sent but logged: ')
  console.log(msg)
}

export default requestEmailVerification
