import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'

interface Body {
  name: string
  type: string
  orbit: number
  speed: number
  radius: number
  color: string
}

interface AstronomyParams {
  bodies?: Body[]
  showOrbits?: boolean
  title?: string
}

export const SolarSystem: React.FC<AstronomyParams> = (params) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  
  const bodies = params.bodies || []
  const showOrbits = params.showOrbits || false
  const title = params.title || 'Astronomy'

  if (bodies.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
        <svg width="100%" height="100%" viewBox="0 0 800 500">
          <text x="400" y="250" fill="#666" fontSize="18" textAnchor="middle">
            No celestial bodies
          </text>
        </svg>
      </AbsoluteFill>
    )
  }

  const centerX = 400
  const centerY = 250
  const time = frame / fps

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 500">
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
    </AbsoluteFill>
  )
}
