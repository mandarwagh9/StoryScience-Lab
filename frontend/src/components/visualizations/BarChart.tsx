import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'

interface DataBar {
  label: string
  value: number
  color?: string
}

interface BarChartProps {
  data?: DataBar[]
  title?: string
}

const defaultData: DataBar[] = [
  { label: 'H', value: 1, color: '#C6FF00' },
  { label: 'He', value: 0.5, color: '#FF6B6B' },
  { label: 'Li', value: 1.5, color: '#4ADE80' },
  { label: 'Be', value: 2, color: '#60A5FA' },
  { label: 'B', value: 2.5, color: '#F472B6' },
  { label: 'C', value: 2.5, color: '#A78BFA' },
]

export const BarChart: React.FC<BarChartProps> = ({
  data = defaultData,
  title = 'Electronegativity by Element'
}) => {
  const frame = useCurrentFrame()
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 500">
        <text x="50" y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">
          {title}
        </text>

        <line x1="100" y1="400" x2="700" y2="400" stroke="#333" strokeWidth="2" />
        <line x1="100" y1="400" x2="100" y2="100" stroke="#333" strokeWidth="2" />

        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line x1="100" y1={400 - i * 75} x2="700" y2={400 - i * 75} stroke="#222" strokeWidth="1" />
            <text x="85" y={405 - i * 75} fill="#666" fontSize="12" textAnchor="end">
              {((maxValue / 3) * i).toFixed(1)}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * 225
          const x = 130 + i * 90
          const animatedHeight = interpolate(
            frame,
            [0, 30 + i * 10],
            [0, barHeight],
            { extrapolateRight: 'clamp' }
          )

          return (
            <g key={i}>
              <rect
                x={x}
                y={400 - animatedHeight}
                width="60"
                height={animatedHeight}
                fill={d.color || '#C6FF00'}
                rx="4"
              />
              <text
                x={x + 30}
                y="425"
                fill="#A0A0A0"
                fontSize="14"
                textAnchor="middle"
              >
                {d.label}
              </text>
              <text
                x={x + 30}
                y={400 - animatedHeight - 10}
                fill="#F5F5F5"
                fontSize="12"
                textAnchor="middle"
              >
                {d.value.toFixed(1)}
              </text>
            </g>
          )
        })}

        <text x="50" y="470" fill="#A0A0A0" fontSize="14">
          Electronegativity measures an atom's ability to attract electrons in a chemical bond.
        </text>
      </svg>
    </AbsoluteFill>
  )
}
