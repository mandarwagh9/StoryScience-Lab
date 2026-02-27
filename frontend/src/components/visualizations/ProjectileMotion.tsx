import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
}

interface ParticleParams {
  particles?: Particle[]
  bounds?: [number, number]
  trail?: boolean
  title?: string
}

export const ProjectileMotion: React.FC<ParticleParams> = (params) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  
  const particles = params.particles || []
  const bounds = params.bounds || [800, 500]
  const trail = params.trail || false
  const title = params.title || 'Particles'

  if (particles.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${bounds[0]} ${bounds[1]}`}>
          <text x={bounds[0]/2} y={bounds[1]/2} fill="#666" fontSize="18" textAnchor="middle">
            No particles
          </text>
        </svg>
      </AbsoluteFill>
    )
  }

  const time = frame / fps

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${bounds[0]} ${bounds[1]}`}>
        <text x="20" y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">
          {title}
        </text>
        
        <line x1="0" y1={bounds[1] - 50} x2={bounds[0]} y2={bounds[1] - 50} stroke="#333" strokeWidth="1" />
        <line x1="50" y1={bounds[1]} x2="50" y2="0" stroke="#333" strokeWidth="1" />

        {trail && particles.map((p, i) => {
          const trailPoints = []
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
    </AbsoluteFill>
  )
}
