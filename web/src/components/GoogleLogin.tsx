import React from 'react'
import styled from 'styled-components'

const GSignInButton = styled.a`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  margin: 10px;
  display: inline-block;
  width: 240px;
  height: 50px;
  background-color: #4285f4;
  color: #fff;
  border-radius: 1px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  transition: background-color 0.218s, border-color 0.218s, box-shadow 0.218s;

  &:hover {
    cursor: pointer;
    -webkit-box-shadow: 0 0 3px 3px rgba(66, 133, 244, 0.3);
    box-shadow: 0 0 3px 3px rgba(66, 133, 244, 0.3);
  }

  &:active {
    background-color: #3367d6;
    transition: background-color 0.2s;
  }
`

const ContentWrapper = styled.div`
  height: 100%;
  width: 100%;
  border: 1px solid transparent;
`
const Img = styled.img`
  width: 18px;
  height: 18px;
`

const LogoWrapper = styled.div`
  padding: 15px;
  background: #fff;
  width: 48px;
  height: 100%;
  border-radius: 1px;
  display: inline-block;
`

const TextContainer = styled.span`
  font-family: Roboto, arial, sans-serif;
  font-weight: 500;
  letter-spacing: 0.21px;
  font-size: 16px;
  line-height: 48px;
  vertical-align: top;
  border: none;
  display: inline-block;
  text-align: center;
  width: 180px;
`
function GoogleLogin({ onClick }: { onClick: () => void }) {
  return (
    <GSignInButton onClick={() => onClick()} href="#">
      <ContentWrapper>
        <LogoWrapper>
          <Img src="https://developers.google.com/identity/images/g-logo.png" />
        </LogoWrapper>
        <TextContainer>
          <span>Sign in with Google</span>
        </TextContainer>
      </ContentWrapper>
    </GSignInButton>
  )
}

export default GoogleLogin
