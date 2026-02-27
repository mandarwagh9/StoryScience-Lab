import { useState, useEffect, useRef } from 'react'

interface Step {
  label: string
  pos: [number, number]
  color: string
}

interface ProcessFlowProps {
  steps?: Step[]
  flow?: boolean
  animateFlow?: boolean
  title?: string
}

export default function ProcessFlow({ steps = [], animateFlow = false, title = 'Process' }: ProcessFlowProps) {
  const [progress, setProgress] = useState(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!animateFlow) return
    
    const animate = () => {
      setProgress(p => (p + 0.02) % 1)
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [animateFlow])

  if (steps.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-bg-secondary rounded-lg">
        <p className="text-text-secondary">No steps defined</p>
      </div>
    )
  }

  return (
    <div className="w-full h-64 bg-bg-secondary rounded-lg overflow-hidden">
      <svg viewBox="0 0 800 500" className="w-full h-full">
        <text x="50" y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">
          {title}
        </text>

        {steps.map((step, i) => {
          const x = step.pos[0]
          const y = step.pos[1]
          
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="30" fill={step.color} opacity="0.3" />
              <circle cx={x} cy={y} r="25" fill={step.color} stroke={step.color} strokeWidth="2" />
              <text x={x} y={y + 5} fill="#0A0A0A" fontSize="14" fontWeight="bold" textAnchor="middle">
                {i + 1}
              </text>
              <text x={x} y={y + 50} fill="#F5F5F5" fontSize="14" textAnchor="middle">
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
          
          const currentX = x1 + (x2 - x1) * progress
          const currentY = y1 + (y2 - y1) * progress
          
          return (
            <g key={`flow-${i}`}>
              <line x1={x1 + 25} y1={y1} x2={x2 - 25} y2={y2} stroke="#444" strokeWidth="3" />
              {animateFlow && (
                <circle cx={currentX} cy={currentY} r="8" fill="#C6FF00">
                  <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
