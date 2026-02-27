import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'

interface SolarSystemProps {
  showOrbits?: boolean
}

export const SolarSystem: React.FC<SolarSystemProps> = ({ showOrbits = true }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const planets = [
    { name: 'Mercury', r: 30, size: 4, speed: 4.7, color: '#A0A0A0' },
    { name: 'Venus', r: 50, size: 7, speed: 3.5, color: '#F5D76E' },
    { name: 'Earth', r: 75, size: 7.5, speed: 2.9, color: '#4ADE80' },
    { name: 'Mars', r: 100, size: 5, speed: 2.4, color: '#FF6B6B' },
    { name: 'Jupiter', r: 150, size: 15, speed: 1.3, color: '#F5D76E' },
    { name: 'Saturn', r: 200, size: 12, speed: 0.9, color: '#F4D03F' },
  ]

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
          Solar System - Orbital Motion
        </text>

        <circle cx="400" cy="250" r="60" fill="url(#glow)" />
        <circle cx="400" cy="250" r="30" fill="url(#sunGradient)" />

        <text x="435" y="255" fill="#B8860B" fontSize="12" fontWeight="bold">Sun</text>

        {showOrbits && planets.map((p, i) => (
          <circle
            key={`orbit-${i}`}
            cx="400"
            cy="250"
            r={p.r}
            fill="none"
            stroke="#333"
            strokeWidth="1"
            strokeDasharray="4"
          />
        ))}

        {planets.map((p, i) => {
          const angle = (time * p.speed * Math.PI) / 30
          const x = 400 + p.r * Math.cos(angle)
          const y = 250 + p.r * Math.sin(angle)

          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={p.size}
                fill={p.color}
              />
              <text
                x={x + p.size + 5}
                y={y + 4}
                fill="#A0A0A0"
                fontSize="10"
              >
                {p.name}
              </text>
            </g>
          )
        })}

        <rect x="50" y="420" width="700" height="1" fill="#222" />

        <text x="50" y="450" fill="#A0A0A0" fontSize="12">
          Orbital speeds (inner to outer): Mercury 4.7 → Saturn 0.9 km/s
        </text>
        <text x="50" y="470" fill="#666" fontSize="11">
          Planets closer to the Sun orbit faster due to stronger gravitational pull
        </text>
      </svg>
    </AbsoluteFill>
  )
}
