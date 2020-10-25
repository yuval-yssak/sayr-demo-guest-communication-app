import { describe, it } from 'mocha'
import { expect } from 'chai'
import axios from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import toughCookie, { Cookie } from 'tough-cookie'

const refreshTokenUrl = 'http://localhost:4000/refresh-token',
  graphqlUrl = 'http://localhost:4000/graphql'

describe('test exchanging tokens', function () {
  const axiosWithCookies = axiosCookieJarSupport(axios)

  it('posts without a cookie', async function () {
    const response = await axiosWithCookies.post(refreshTokenUrl, '', {
      withCredentials: true
    })

    expect(response.data).to.deep.include({ ok: false, accessToken: '' })
  })

  it('posts with an expired jwt in cookie')

  it('posts with a malformed jwt in cookie', async function () {
    const cookie = new Cookie({ key: 'rx', value: '123', httpOnly: true })

    const cookiejar = new toughCookie.CookieJar()
    cookiejar.setCookieSync(cookie, refreshTokenUrl)

    const response = await axiosWithCookies.post(refreshTokenUrl, '', {
      jar: cookiejar,
      withCredentials: true
    })

    expect(response.data).to.deep.include({ ok: false, accessToken: '' })
  })

  it('real posts with a good auth cookie', async function () {
    const cookiejar = new toughCookie.CookieJar()
    const query = `mutation {
      login(email: "test@example.org", password: "123") {
        accessToken  
      }
    }`

    await axiosWithCookies.post(
      graphqlUrl,
      { query },
      { jar: cookiejar, withCredentials: true }
    )

    const response = await axiosWithCookies.post(refreshTokenUrl, 'text', {
      jar: cookiejar,
      withCredentials: true
    })

    expect(response.data).to.include({ ok: true })
    expect(response.data.accessToken).to.not.be.empty
  })

  it('refresh afer revoking token', async function () {
    const cookiejar = new toughCookie.CookieJar()
    const query = `mutation {
      login(email: "test@example.org", password: "123") {
        accessToken  
      }
    }`

    const revokeTokenQuery = `mutation {
      revokeRefreshTokensForUser(userId: "5f95e44bea88e13e8f972f5c")
    }`

    await axiosWithCookies.post(
      graphqlUrl,
      { query },
      { jar: cookiejar, withCredentials: true }
    )

    await axiosWithCookies.post(graphqlUrl, { query: revokeTokenQuery })

    const response = await axiosWithCookies.post(refreshTokenUrl, '', {
      jar: cookiejar,
      withCredentials: true
    })

    expect(response.data).to.deep.include({ ok: false, accessToken: '' })
  })
})
