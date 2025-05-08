import React from 'react'
import styled from 'styled-components'

const ControlPanelContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  padding: ${({ theme }) => theme.space.md};
  margin: 0;
`

const PanelTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.sm};
  font-size: ${({ theme }) => theme.fontSizes.large};
`

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
`

const ControlPanel: React.FC = () => {
  return (
    <ControlPanelContainer>
      <PanelTitle>Controls</PanelTitle>
      <ControlsWrapper>
        {/* Control panel content will go here */}
      </ControlsWrapper>
    </ControlPanelContainer>
  )
}

export default ControlPanel 
 