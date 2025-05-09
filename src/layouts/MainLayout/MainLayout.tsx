import React from 'react'
import type { ReactNode } from 'react'
import styled from 'styled-components'
import Header from '../../shared/components/layout/header'
import Footer from '../../shared/components/layout/footer'

interface MainLayoutProps {
  children: ReactNode
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
  padding: 0;
`

const Main = styled.main`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.light};
  min-height: 70vh;

  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
    min-height: 80vh;
  }
`

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <Main>
        {children}
      </Main>
      <Footer />
    </LayoutContainer>
  )
}

export default MainLayout 