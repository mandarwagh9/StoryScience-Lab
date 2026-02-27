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
  
  const waves = params.waves || []
  const showGrid = params.showGrid || false
  const fill = params.fill || false
  const title = params.title || 'Wave'

  if (waves.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
        <svg width="100%" height="100%" viewBox="0 0 800 400">
          <text x="400" y="200" fill="#666" fontSize="18" textAnchor="middle">
            No wave data
          </text>
        </svg>
      </AbsoluteFill>
    )
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 400">
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
      </svg>
    </AbsoluteFill>
  )
}
