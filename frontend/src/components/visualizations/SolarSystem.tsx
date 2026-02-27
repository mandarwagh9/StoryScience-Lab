import { useState, useEffect, useRef } from 'react'

interface Body {
  name: string
  type: string
  orbit: number
  speed: number
  radius: number
  color: string
}

interface SolarSystemProps {
  bodies?: Body[]
  showOrbits?: boolean
  title?: string
}

export default function SolarSystem({ bodies = [], showOrbits = false, title = 'Astronomy' }: SolarSystemProps) {
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

  if (bodies.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-bg-secondary rounded-lg">
        <p className="text-text-secondary">No celestial bodies</p>
      </div>
    )
  }

  const centerX = 400
  const centerY = 250
  const time = frame / 60

  return (
    <div className="w-full h-64 bg-bg-secondary rounded-lg overflow-hidden">
      <svg viewBox="0 0 800 500" className="w-full h-full">
        <text x="50" y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">
          {title}
        </text>

        {showOrbits && bodies.filter(b => b.type === 'planet').map((body, i) => (
          <circle
            key={`orbit-${i}`}
            cx={centerX}
            cy={centerY}
            r={body.orbit}
            fill="none"
            stroke="#333"
            strokeWidth="1"
            strokeDasharray="4"
          />
        ))}

        {bodies.map((body, i) => {
          if (body.type === 'star') {
            return (
              <g key={i}>
                <circle cx={centerX} cy={centerY} r={body.radius + 20} fill="#FFD700" opacity="0.2" />
                <circle cx={centerX} cy={centerY} r={body.radius} fill={body.color} />
                <text x={centerX + body.radius + 10} y={centerY + 5} fill="#B8860B" fontSize="12" fontWeight="bold">{body.name}</text>
              </g>
            )
          }
          
          const angle = time * body.speed
          const x = centerX + body.orbit * Math.cos(angle)
          const y = centerY + body.orbit * Math.sin(angle)
          
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={body.radius} fill={body.color} />
              <text x={x + body.radius + 5} y={y + 4} fill="#A0A0A0" fontSize="10">{body.name}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
