import { useState, useEffect, useRef } from 'react'

interface DataBar {
  label: string
  value: number
  color: string
}

interface BarChartProps {
  data?: DataBar[]
  animate?: boolean
  title?: string
}

export default function BarChart({ data = [], animate = true, title = 'Data' }: BarChartProps) {
  const [animatedData, setAnimatedData] = useState<number[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!animate || data.length === 0) {
      setAnimatedData(data.map(() => 1))
      return
    }
    
    let startTime: number | null = null
    const duration = 1000
    
    const anim = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      setAnimatedData(data.map(() => progress))
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(anim)
      }
    }
    animationRef.current = requestAnimationFrame(anim)
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [data, animate])

  if (data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-bg-secondary rounded-lg">
        <p className="text-text-secondary">No data available</p>
      </div>
    )
  }

  const maxValue = Math.max(...data.map(d => d.value))
  const width = 800
  const height = 500
  const padding = { top: 80, right: 50, bottom: 80, left: 100 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  const barWidth = (chartWidth / data.length) * 0.6
  const barGap = (chartWidth / data.length) * 0.4

  return (
    <div className="w-full h-64 bg-bg-secondary rounded-lg overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <text x={padding.left} y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">
          {title}
        </text>

        <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#333" strokeWidth="2" />
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#333" strokeWidth="2" />

        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = height - padding.bottom - (ratio * chartHeight)
          return (
            <g key={ratio}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#222" strokeWidth="1" />
              <text x={padding.left - 10} y={y + 4} fill="#666" fontSize="12" textAnchor="end">
                {(maxValue * ratio).toFixed(0)}
              </text>
            </g>
          )
        })}

        {data.map((d, i) => {
          const barHeight = maxValue > 0 ? (d.value / maxValue) * chartHeight : 0
          const x = padding.left + i * (barWidth + barGap) + barGap / 2
          const y = height - padding.bottom - (barHeight * (animatedData[i] || 1))
          const currentHeight = barHeight * (animatedData[i] || 1)
          
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={currentHeight}
                fill={d.color || '#C6FF00'}
                rx="4"
              />
              <text
                x={x + barWidth / 2}
                y={height - padding.bottom + 20}
                fill="#A0A0A0"
                fontSize="14"
                textAnchor="middle"
              >
                {d.label}
              </text>
              {currentHeight > 20 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 10}
                  fill="#F5F5F5"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {d.value}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
