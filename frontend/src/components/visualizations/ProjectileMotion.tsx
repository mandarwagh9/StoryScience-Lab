import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'

interface ProjectileMotionProps {
  velocity?: number
  angle?: number
  gravity?: number
}

export const ProjectileMotion: React.FC<ProjectileMotionProps> = ({
  velocity = 60,
  angle = 45,
  gravity = 9.8
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const angleRad = (angle * Math.PI) / 180
  const vx = velocity * Math.cos(angleRad)
  const vy = velocity * Math.sin(angleRad)

  const t = frame / fps

  const x = vx * t * 3
  const y = (vy * t - 0.5 * gravity * t * t) * 3

  const ballOpacity = y < 0 ? 0 : 1

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 500">
        <defs>
          <linearGradient id="ballGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C6FF00" />
            <stop offset="100%" stopColor="#88AA00" />
          </linearGradient>
        </defs>
        
        <text x="50" y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">
          Projectile Motion
        </text>
        <text x="50" y="70" fill="#A0A0A0" fontSize="14" fontFamily="system-ui">
          v₀ = {velocity} m/s, θ = {angle}°, g = {gravity} m/s²
        </text>

        <line x1="50" y1="400" x2="750" y2="400" stroke="#A0A0A0" strokeWidth="2" />
        <line x1="50" y1="400" x2="50" y2="50" stroke="#A0A0A0" strokeWidth="2" />

        <text x="720" y="430" fill="#A0A0A0" fontSize="12">Distance (m)</text>
        <text x="20" y="60" fill="#A0A0A0" fontSize="12" transform="rotate(-90, 20, 60)">Height (m)</text>

        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <text key={i} x={50 + i * 100} y="425" fill="#666" fontSize="10">
            {i * 20}
          </text>
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <text key={i} x="25" y={400 - i * 80} fill="#666" fontSize="10">
            {i * 20}
          </text>
        ))}

        {y >= 0 && (
          <circle
            cx={50 + x}
            cy={400 - y}
            r={12}
            fill="url(#ballGradient)"
            style={{ opacity: ballOpacity }}
          />
        )}

        {y >= 0 && (
          <line
            x1={50 + x}
            y1={400}
            x2={50 + x}
            y2={400 - y}
            stroke="#C6FF00"
            strokeWidth="1"
            strokeDasharray="4"
            style={{ opacity: 0.5 }}
          />
        )}

        {y >= 0 && (
          <text
            x={60 + x}
            y={380 - y}
            fill="#C6FF00"
            fontSize="12"
            style={{ opacity: ballOpacity }}
          >
            h = {Math.max(0, y / 3).toFixed(1)}m
          </text>
        )}
      </svg>
    </AbsoluteFill>
  )
}
