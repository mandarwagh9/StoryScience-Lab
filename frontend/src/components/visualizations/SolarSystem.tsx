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
  
  const bodies = params.bodies || [
    { name: 'Sun', type: 'star', orbit: 0, speed: 0, radius: 50, color: '#FFD700' },
    { name: 'Earth', type: 'planet', orbit: 150, speed: 1, radius: 15, color: '#4ECDC4' },
    { name: 'Mars', type: 'planet', orbit: 220, speed: 0.7, radius: 12, color: '#FF6B6B' }
  ]
  const showOrbits = params.showOrbits !== false
  const title = params.title || 'Solar System'

  const centerX = 400
  const centerY = 250
  const time = frame / fps

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 500">
        <defs>
          <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF7AD" />
            <stop offset="100%" stopColor="#FFD700" />
          </radialGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>
        </defs>

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
                <circle cx={centerX} cy={centerY} r={body.radius + 20} fill="url(#glow)" />
                <circle cx={centerX} cy={centerY} r={body.radius} fill="url(#sunGradient)" />
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

        <text x="50" y="470" fill="#666" fontSize="11">
          Animated with Remotion
        </text>
      </svg>
    </AbsoluteFill>
  )
}
