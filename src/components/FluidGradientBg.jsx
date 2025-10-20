import { useEffect, useRef } from 'react'
import Granim from 'granim'

export default function FluidGradientBg() {
  const canvasRef = useRef(null)
  const granimRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current && !granimRef.current) {
      granimRef.current = new Granim({
        element: canvasRef.current,
        direction: 'diagonal',
        isPausedWhenNotInView: true,
        stateTransitionSpeed: 500,
        states: {
          "default-state": {
            gradients: [
              ['#0F0F23', '#1a0b2e', '#16213e', '#0f3460', '#533483'],
              ['#16213e', '#0f3460', '#533483', '#1a0b2e', '#0F0F23'],
              ['#533483', '#16213e', '#1a0b2e', '#0f3460', '#0F0F23']
            ],
            transitionSpeed: 8000,
            loop: true
          }
        }
      })
    }

    return () => {
      if (granimRef.current) {
        granimRef.current.destroy()
        granimRef.current = null
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ opacity: 0.4 }}
    />
  )
}
