import { useState, useEffect } from 'react'
import './App.css'

const FollowMouse = () => {
  // Estados de la app
  const [enabled, setEnabled] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Efecto del mouse
  useEffect(() => {
    console.log('effect', { enabled })

    // Limpiar el listener cuando el componente desaparece
    const handleMove = (event) => {
      // Actualizar la posición
      const { clientX, clientY } = event
      console.log('handleMove', { clientX, clientY })
      // Actualizar el estado
      setPosition({ x: clientX, y: clientY })
    }

    if (enabled) {
      // Agregar el listener cuando enabled es true
      window.addEventListener('pointermove', handleMove)
    }

    return () => {
      // Limpiar el listener cuando enabled es false
      console.log('cleanup')
      window.removeEventListener('pointermove', handleMove)
    }
  }, [enabled])

  return (
    <>
    <div style={{
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid #fff',
        borderRadius: '50%',
        opacity: 0.8,
        pointerEvents: 'none',
        left: -25,
        top: -25,
        width: 50,
        height: 50,
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
      />
      <h3>Proyecto 3</h3>
      <button onClick={() => setEnabled(!enabled)}>
        {enabled ? 'Desactivar' : 'Activar'} seguir puntero
      </button>
    </>
  )
}

function App() {
  return (
    <main>
      <FollowMouse />
    </main>
  )
}

export default App
