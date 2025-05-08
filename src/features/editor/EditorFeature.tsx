import React from 'react'
import Canvas from './components/canvas'
import ControlPanel from './components/control-panel'
import { ShapesProvider } from './context/ShapesContext'

const EditorFeature: React.FC = () => {
  return (
    <ShapesProvider>
      <Canvas />
      <ControlPanel />
    </ShapesProvider>
  )
}

export default EditorFeature 