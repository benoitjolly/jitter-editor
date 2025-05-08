import React from 'react'
import styled from 'styled-components'
import { APP_NAME } from '../../../../shared/config/constants'

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textLight};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
`

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Title>{APP_NAME}</Title>
    </HeaderContainer>
  )
}

export default Header 