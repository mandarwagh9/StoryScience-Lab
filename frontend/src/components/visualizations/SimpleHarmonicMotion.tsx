import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'

interface SimpleHarmonicMotionProps {
  length?: number
  mass?: number
  gravity?: number
}

export const SimpleHarmonicMotion: React.FC<SimpleHarmonicMotionProps> = ({
  length = 150,
  mass = 1,
  gravity = 9.8
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const angularFreq = Math.sqrt(gravity / (length / 100))
  const angle = 0.5 * Math.sin(angularFreq * (frame / fps))

  const bobX = 400 + length * Math.sin(angle)
  const bobY = 100 + length * Math.cos(angle)

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 500">
        <text x="50" y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">
          Simple Harmonic Motion - Pendulum
        </text>
        <text x="50" y="70" fill="#A0A0A0" fontSize="14" fontFamily="system-ui">
          Length: {length}cm | Mass: {mass}kg | g = {gravity} m/s²
        </text>

        <rect x="350" y="50" width="100" height="20" fill="#333" rx="4" />
        <line x1="400" y1="70" x2="400" y2="100" stroke="#666" strokeWidth="4" />

        <line
          x1="400"
          y1="100"
          x2={bobX}
          y2={bobY}
          stroke="#A0A0A0"
          strokeWidth="2"
        />

        <circle cx="400" cy="70" r="8" fill="#666" />

        <circle
          cx={bobX}
          cy={bobY}
          r={15 + mass * 5}
          fill="#C6FF00"
        />

        <text
          x={bobX - 20}
          y={bobY + 5}
          fill="#0A0A0A"
          fontSize="12"
          fontWeight="bold"
        >
          m={mass}kg
        </text>

        <line
          x1={bobX - 30}
          y1="250"
          x2={bobX + 30}
          y2="250"
          stroke="#F5F5F5"
          strokeWidth="1"
          strokeDasharray="4"
          opacity={0.3}
        />

        <line
          x1="400"
          y1="280"
          x2="550"
          y2="280"
          stroke="#A0A0A0"
          strokeWidth="2"
        />
        <text x="560" y="285" fill="#A0A0A0" fontSize="14">
          Equilibrium Position
        </text>

        <text x="50" y="350" fill="#A0A0A0" fontSize="14" fontFamily="system-ui">
          Key Equations:
        </text>
        <text x="50" y="380" fill="#C6FF00" fontSize="14" fontFamily="monospace">
          ω = √(g/L) = {angularFreq.toFixed(2)} rad/s
        </text>
        <text x="50" y="410" fill="#F5F5F5" fontSize="14" fontFamily="monospace">
          θ(t) = θ₀ × sin(ωt)
        </text>
        <text x="50" y="440" fill="#A0A0A0" fontSize="14" fontFamily="monospace">
          Period T = 2π√(L/g) = {(2 * Math.PI * Math.sqrt(length / 100 / gravity)).toFixed(2)}s
        </text>
      </svg>
    </AbsoluteFill>
  )
}
