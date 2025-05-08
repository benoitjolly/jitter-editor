import React from 'react'
import styled from 'styled-components'
import { APP_NAME, APP_VERSION } from '../../../../shared/config/constants'

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.textLight};
  padding: ${({ theme }) => theme.space.sm};
  text-align: center;
`

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <p>{APP_NAME} - v{APP_VERSION}</p>
    </FooterContainer>
  )
}

export default Footer 