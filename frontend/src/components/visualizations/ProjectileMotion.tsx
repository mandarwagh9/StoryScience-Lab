import { useState, useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
}

interface ParticleProps {
  particles?: Particle[]
  bounds?: [number, number]
  trail?: boolean
  title?: string
}

export default function ParticleMotion({ particles = [], bounds = [800, 500], trail = false, title = 'Particles' }: ParticleProps) {
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

  if (particles.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-bg-secondary rounded-lg">
        <p className="text-text-secondary">No particles</p>
      </div>
    )
  }

  const time = frame / 60

  return (
    <div className="w-full h-64 bg-bg-secondary rounded-lg overflow-hidden">
      <svg viewBox={`0 0 ${bounds[0]} ${bounds[1]}`} className="w-full h-full">
        <text x="20" y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">
          {title}
        </text>
        
        <line x1="0" y1={bounds[1] - 50} x2={bounds[0]} y2={bounds[1] - 50} stroke="#333" strokeWidth="1" />
        <line x1="50" y1={bounds[1]} x2="50" y2="0" stroke="#333" strokeWidth="1" />

        {trail && particles.map((p, i) => {
          const trailPoints: string[] = []
          for (let t = 0; t <= Math.min(time, 3); t += 0.1) {
            const tx = (p.x + p.vx * t) * bounds[0]
            const ty = bounds[1] - 50 - (p.y + p.vy * t) * bounds[1]
            if (tx >= 0 && tx <= bounds[0] && ty >= 0 && ty <= bounds[1]) {
              trailPoints.push(`${tx},${ty}`)
            }
          }
          return (
            <polyline
              key={`trail-${i}`}
              points={trailPoints.join(' ')}
              fill="none"
              stroke={p.color}
              strokeWidth="2"
              opacity="0.3"
            />
          )
        })}

        {particles.map((p, i) => {
          const x = (p.x + p.vx * time) * bounds[0]
          const y = bounds[1] - 50 - (p.y + p.vy * time) * bounds[1]
          
          if (x < 0 || x > bounds[0] || y < 0 || y > bounds[1]) return null
          
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="10"
              fill={p.color}
            />
          )
        })}
      </svg>
    </div>
  )
}
