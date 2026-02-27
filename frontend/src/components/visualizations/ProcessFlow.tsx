import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'

interface Step {
  label: string
  pos: [number, number]
  color: string
}

interface ProcessParams {
  steps?: Step[]
  flow?: boolean
  animateFlow?: boolean
  title?: string
}

export const ProcessFlow: React.FC<ProcessParams> = (params) => {
  const frame = useCurrentFrame()
  
  const steps = params.steps || []
  const animateFlow = params.animateFlow || false
  const title = params.title || 'Process'

  if (steps.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
        <svg width="100%" height="100%" viewBox="0 0 800 500">
          <text x="400" y="250" fill="#666" fontSize="18" textAnchor="middle">
            No steps defined
          </text>
        </svg>
      </AbsoluteFill>
    )
  }

  const width = 800
  const height = 500
  const padding = 50

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <text x={padding} y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">
          {title}
        </text>

        {steps.map((step, i) => {
          const x = step.pos[0]
          const y = step.pos[1]
          
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="30"
                fill={step.color}
                opacity="0.3"
              />
              <circle
                cx={x}
                cy={y}
                r="25"
                fill={step.color}
                stroke={step.color}
                strokeWidth="2"
              />
              <text
                x={x}
                y={y + 5}
                fill="#0A0A0A"
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
              >
                {i + 1}
              </text>
              <text
                x={x}
                y={y + 50}
                fill="#F5F5F5"
                fontSize="14"
                textAnchor="middle"
              >
                {step.label}
              </text>
            </g>
          )
        })}

        {steps.map((_, i) => {
          if (i >= steps.length - 1) return null
          const x1 = steps[i].pos[0]
          const y1 = steps[i].pos[1]
          const x2 = steps[i + 1].pos[0]
          const y2 = steps[i + 1].pos[1]
          
          const progress = animateFlow 
            ? interpolate(frame % 60, [0, 60], [0, 1], { extrapolateRight: 'clamp' })
            : 1
          
          const currentX = x1 + (x2 - x1) * progress
          const currentY = y1 + (y2 - y1) * progress
          
          return (
            <g key={`flow-${i}`}>
              <line
                x1={x1 + 25}
                y1={y1}
                x2={x2 - 25}
                y2={y2}
                stroke="#444"
                strokeWidth="3"
              />
              {animateFlow && (
                <circle
                  cx={currentX}
                  cy={currentY}
                  r="8"
                  fill="#C6FF00"
                />
              )}
              <polygon
                points={`${x2 - 35},${y2 - 5} ${x2 - 25},${y2} ${x2 - 35},${y2 + 5}`}
                fill="#444"
              />
            </g>
          )
        })}
      </svg>
    </AbsoluteFill>
  )
}
