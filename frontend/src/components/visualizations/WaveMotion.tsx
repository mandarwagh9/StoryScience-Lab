import { useState, useEffect, useRef } from 'react'

interface Wave {
  amplitude: number
  frequency: number
  wavelength: number
  phase: number
  color: string
}

interface WaveMotionProps {
  waves?: Wave[]
  showGrid?: boolean
  fill?: boolean
  title?: string
}

export default function WaveMotion({ waves = [], showGrid = false, fill = false, title = 'Wave' }: WaveMotionProps) {
  const [frame, setFrame] = useState(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    let lastTime = performance.now()
    
    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000
      lastTime = currentTime
      setFrame(f => f + delta * 60)
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  if (waves.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-bg-secondary rounded-lg">
        <p className="text-text-secondary">No wave data</p>
      </div>
    )
  }

  const width = 800
  const height = 400

  return (
    <div className="w-full h-64 bg-bg-secondary rounded-lg overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <text x="50" y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">
          {title}
        </text>

        {showGrid && (
          <>
            <line x1="50" y1="200" x2="750" y2="200" stroke="#333" strokeWidth="1" />
            <line x1="50" y1="50" x2="50" y2="350" stroke="#333" strokeWidth="1" />
          </>
        )}

        {waves.map((wave, wi) => {
          const points: string[] = []
          
          for (let x = 50; x <= 750; x += 5) {
            const phase = (2 * Math.PI * (x - 50)) / wave.wavelength
            const y = wave.amplitude * Math.sin(phase - (frame / 60) * wave.frequency * 2 * Math.PI + wave.phase)
            points.push(`${x},${200 + y}`)
          }

          return (
            <g key={wi}>
              {fill && (
                <path 
                  d={`M50,200 L${points.join(' L')} L750,200 Z`} 
                  fill={wave.color} 
                  opacity="0.15" 
                />
              )}
              <polyline
                points={points.join(' ')}
                fill="none"
                stroke={wave.color}
                strokeWidth="3"
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
