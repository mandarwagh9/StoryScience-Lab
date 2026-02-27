import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'

interface WaveMotionProps {
  amplitude?: number
  frequency?: number
  wavelength?: number
}

export const WaveMotion: React.FC<WaveMotionProps> = ({
  amplitude = 50,
  frequency = 1,
  wavelength = 100
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const points: { x: number; y: number }[] = []
  
  for (let x = 0; x <= 800; x += 5) {
    const phase = (2 * Math.PI * x) / wavelength
    const y = amplitude * Math.sin(phase - (frame / fps) * frequency * 2 * Math.PI)
    points.push({ x, y: 150 + y })
  }

  const pointsPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 400">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C6FF00" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#C6FF00" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C6FF00" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <text x="50" y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">
          Wave Motion
        </text>
        <text x="50" y="70" fill="#A0A0A0" fontSize="14" fontFamily="system-ui">
          Amplitude: {amplitude}px | Frequency: {frequency}Hz | Wavelength: {wavelength}px
        </text>

        <line x1="50" y1="150" x2="750" y2="150" stroke="#333" strokeWidth="1" />
        <line x1="50" y1="50" x2="50" y2="250" stroke="#333" strokeWidth="1" />

        <polygon
          points={`50,150 ${points.map(p => `${p.x},${p.y}`).join(' ')} 750,150`}
          fill="url(#waveGradient)"
        />

        <path
          d={pointsPath}
          fill="none"
          stroke="#C6FF00"
          strokeWidth="3"
        />

        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <circle key={i} cx={50 + i * wavelength / 2} cy={150} r="4" fill="#666" />
        ))}

        <line
          x1={50 + wavelength / 4}
          y1={150 - amplitude}
          x2={50 + wavelength / 4}
          y2={150 + amplitude}
          stroke="#F5F5F5"
          strokeWidth="1"
          strokeDasharray="4"
        />
        <text x={50 + wavelength / 4 - 20} y={150 - amplitude - 10} fill="#F5F5F5" fontSize="12">
          λ/4
        </text>

        <line x1="50" y1="300" x2="300" y2="300" stroke="#A0A0A0" strokeWidth="2" />
        <text x="320" y="305" fill="#A0A0A0" fontSize="14">
          Wavelength (λ) = {wavelength}px
        </text>

        <line x1="50" y1="330" x2="180" y2="330" stroke="#C6FF00" strokeWidth="2" />
        <text x="190" y="335" fill="#C6FF00" fontSize="14">
          Amplitude = {amplitude}px
        </text>
      </svg>
    </AbsoluteFill>
  )
}
