import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'

interface WaveParams {
  waves?: {
    amplitude: number
    frequency: number
    wavelength: number
    phase: number
    color: string
  }[]
  showGrid?: boolean
  fill?: boolean
  title?: string
}

export const WaveMotion: React.FC<WaveParams> = (params) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  
  const waves = params.waves || [
    { amplitude: 60, frequency: 1.5, wavelength: 120, phase: 0, color: '#C6FF00' },
    { amplitude: 40, frequency: 2, wavelength: 80, phase: 1.57, color: '#FF6B6B' }
  ]
  const showGrid = params.showGrid !== false
  const fill = params.fill !== false
  const title = params.title || 'Wave Motion'

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
          {title}
        </text>

        {showGrid && (
          <>
            <line x1="50" y1="200" x2="750" y2="200" stroke="#333" strokeWidth="1" />
            <line x1="50" y1="50" x2="50" y2="350" stroke="#333" strokeWidth="1" />
          </>
        )}

        {waves.map((wave, wi) => {
          const points: { x: number; y: number }[] = []
          
          for (let x = 50; x <= 750; x += 5) {
            const phase = (2 * Math.PI * (x - 50)) / wave.wavelength
            const y = wave.amplitude * Math.sin(phase - (frame / fps) * wave.frequency * 2 * Math.PI + wave.phase)
            points.push({ x, y: 200 + y })
          }

          const pointsPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

          return (
            <g key={wi}>
              {fill && (
                <path 
                  d={`50,200 ${pointsPath} 750,200`} 
                  fill={wave.color} 
                  opacity="0.15" 
                />
              )}
              <path
                d={pointsPath}
                fill="none"
                stroke={wave.color}
                strokeWidth="3"
              />
            </g>
          )
        })}

        <text x="50" y="380" fill="#A0A0A0" fontSize="12" fontFamily="system-ui">
          {waves.map(w => `${w.color} λ=${w.wavelength} f=${w.frequency}`).join(' | ')}
        </text>
      </svg>
    </AbsoluteFill>
  )
}
