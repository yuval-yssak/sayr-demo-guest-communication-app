import { describe, it } from 'mocha'
import { expect } from 'chai'
import axios from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import toughCookie, { Cookie } from 'tough-cookie'

describe('test exchanging tokens', function () {
  const axiosWithCookies = axiosCookieJarSupport(axios)

  it('posts without a cookie')
  it('posts with an expired jwt in cookie')

  it('posts with a malformed jwt in cookie', async function () {
    const cookie = new Cookie({
      key: 'rx',
      value: '123',
      httpOnly: true
    })

    const cookiejar: toughCookie.CookieJar = new toughCookie.CookieJar()

    cookiejar.setCookieSync(cookie, 'http://localhost:4000/refresh-token')

    const response = await axiosWithCookies.post(
      'http://localhost:4000/refresh-token',
      'text',
      {
        jar: cookiejar,
        withCredentials: true
      }
    )

    expect(response.data.ok).to.equal(false)
    expect(response.data.accessToken).to.be.empty
  })

  it('real posts with a good auth cookie', async function () {
    const cookiejar = new toughCookie.CookieJar()

    await axiosWithCookies.post(
      'http://localhost:4000/graphql',
      {
        query: `mutation {
          login(email: "test@example.org", password: "123") {
            accessToken  
          }
        }`
      },
      {
        jar: cookiejar,
        withCredentials: true
      }
    )
    const response = await axiosWithCookies.post(
      'http://localhost:4000/refresh-token',
      'text',
      {
        jar: cookiejar,
        withCredentials: true
      }
    )

    expect(response.data.ok).to.equal(true)
    expect(response.data.accessToken).not.to.be.empty
  })
  it('posts with a good auth cookie', async function () {
    const cookie = new Cookie({
      key: 'rx',
      value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjkzOWIyZmVkZGUzODQyMzE5OTViZmUiLCJpYXQiOjE2MDM1ODQ5NjAsImV4cCI6MTYwNDE4OTc2MH0.bF-pegq4NPEqJpxzHQT-a_fbTirAc2-oFsxN_AKF4Nc`,
      httpOnly: true
    })

    const cookiejar: toughCookie.CookieJar = new toughCookie.CookieJar()

    cookiejar.setCookieSync(cookie, 'http://localhost:4000/refresh-token')

    const response = await axiosWithCookies.post(
      'http://localhost:4000/refresh-token',
      'text',
      {
        jar: cookiejar,
        withCredentials: true
      }
    )

    expect(response.data.ok).to.equal(true)
    expect(response.data.accessToken).not.to.be.empty
  })
})
