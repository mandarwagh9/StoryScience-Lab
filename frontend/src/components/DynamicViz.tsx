import { useState, useEffect } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
}

interface VizParams {
  particles?: Particle[]
  bounds?: [number, number]
  trail?: boolean
  waves?: { amplitude: number; frequency: number; wavelength: number; phase: number; color: string }[]
  showGrid?: boolean
  fill?: boolean
  circuitComponents?: any[]
  atoms?: { element: string; pos: [number, number]; color: string }[]
  bonds?: number[][]
  animateRotation?: boolean
  functions?: { eq: string; color: string; lineWidth: number }[]
  xRange?: [number, number]
  yRange?: [number, number]
  animate?: boolean
  mechanicalComponents?: { type: string; pos?: [number, number]; radius?: number; color?: string; mass?: number; gravity?: number }[]
  bodies?: { name: string; type: string; pos?: [number, number]; orbit?: number; speed?: number; radius?: number; color?: string; parent?: number }[]
  showOrbits?: boolean
  data?: { label: string; value: number; color: string }[]
  title?: string
  style?: string
  steps?: { label: string; pos: [number, number]; color: string }[]
  flow?: boolean
  animateFlow?: boolean
  [key: string]: any
}

interface DynamicVizProps {
  config: {
    type: string
    title?: string
    params?: VizParams
  }
}

export default function DynamicViz({ config }: DynamicVizProps) {
  const [frame, setFrame] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  const params = config.params || {}

  const getDefaultParams = (type: string) => {
    switch (type) {
      case 'circuit':
        return {
          circuitComponents: [
            { type: 'battery', pos: [100, 200], voltage: 9 },
            { type: 'wire', from: [140, 200], to: [300, 200] },
            { type: 'resistor', pos: [300, 200], resistance: 100 },
            { type: 'wire', from: [350, 200], to: [350, 350] },
            { type: 'wire', from: [350, 350], to: [100, 350] },
            { type: 'wire', from: [100, 350], to: [100, 260] },
            { type: 'led', pos: [250, 275], color: '#C6FF00' },
          ],
          showCurrent: true,
        }
      case 'wave':
        return {
          waves: [
            { amplitude: 60, frequency: 1.5, wavelength: 120, phase: 0, color: '#C6FF00' },
            { amplitude: 40, frequency: 2, wavelength: 80, phase: Math.PI / 4, color: '#FF6B6B' },
          ],
          showGrid: true,
          fill: true,
        }
      case 'particle':
        return {
          particles: [
            { x: 0.2, y: 0.3, vx: 2, vy: 1.5, color: '#C6FF00' },
            { x: 0.5, y: 0.6, vx: -1.5, vy: 2, color: '#FF6B6B' },
            { x: 0.7, y: 0.4, vx: 1, vy: -2, color: '#4ECDC4' },
            { x: 0.3, y: 0.8, vx: -2, vy: -1, color: '#FFE66D' },
          ],
          bounds: [800, 500] as [number, number],
          trail: true,
        }
      case 'molecule':
        return {
          atoms: [
            { element: 'O', pos: [300, 250] as [number, number], color: '#FF6B6B' },
            { element: 'H', pos: [250, 320] as [number, number], color: '#F5F5F5' },
            { element: 'H', pos: [350, 320] as [number, number], color: '#F5F5F5' },
          ],
          bonds: [[0, 1], [0, 2]],
          animateRotation: true,
        }
      case 'graph':
        return {
          functions: [
            { eq: 'sin(x)', color: '#C6FF00', lineWidth: 3 },
            { eq: 'cos(x)', color: '#FF6B6B', lineWidth: 2 },
          ],
          xRange: [-10, 10] as [number, number],
          yRange: [-3, 3] as [number, number],
          showGrid: true,
          animate: true,
        }
      case 'astronomy':
        return {
          bodies: [
            { name: 'Sun', type: 'star', pos: [400, 250] as [number, number], radius: 50 },
            { name: 'Earth', type: 'planet', orbit: 150, speed: 1, radius: 15, color: '#4ECDC4', parent: 0 },
            { name: 'Mars', type: 'planet', orbit: 220, speed: 0.7, radius: 12, color: '#FF6B6B', parent: 0 },
          ],
          showOrbits: true,
        }
      case 'bar':
        return {
          data: [
            { label: 'Step 1', value: 75, color: '#C6FF00' },
            { label: 'Step 2', value: 45, color: '#FF6B6B' },
            { label: 'Step 3', value: 90, color: '#4ECDC4' },
            { label: 'Step 4', value: 60, color: '#FFE66D' },
          ],
          animate: true,
        }
      case 'process':
        return {
          steps: [
            { label: 'Input', pos: [150, 200] as [number, number], color: '#C6FF00' },
            { label: 'Process', pos: [400, 200] as [number, number], color: '#FF6B6B' },
            { label: 'Output', pos: [650, 200] as [number, number], color: '#4ECDC4' },
          ],
          flow: true,
          animateFlow: true,
        }
      default:
        return {}
    }
  }

  const effectiveParams = Object.keys(params).length === 0 
    ? getDefaultParams(config.type)
    : params

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let animFrame: number
    const animate = () => {
      setFrame(f => f + 1)
      animFrame = requestAnimationFrame(animate)
    }
    animFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrame)
  }, [])

  useEffect(() => {
    if (effectiveParams.particles && effectiveParams.particles.length > 0) {
      const bounds = effectiveParams.bounds || [800, 500]
      setParticles(effectiveParams.particles.map(p => ({
        ...p,
        x: p.x * bounds[0],
        y: p.y * bounds[1]
      })))
    }
  }, [effectiveParams.particles, effectiveParams.bounds])

  useEffect(() => {
    if (config.type !== 'particle' || particles.length === 0) return
    const bounds = effectiveParams.bounds || [800, 500]
    
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => {
        let { x, y, vx, vy } = p
        x += vx * 5
        y += vy * 5
        
        if (x <= 0 || x >= bounds[0]) vx = -vx
        if (y <= 0 || y >= bounds[1]) vy = -vy
        
        return { ...p, x, y, vx, vy }
      }))
    }, 50)
    
    return () => clearInterval(interval)
  }, [config.type, particles.length, effectiveParams.bounds])

  const renderParticleViz = () => {
    const bounds = effectiveParams.bounds || [800, 500]
    
    return (
      <svg viewBox={`0 0 ${bounds[0]} ${bounds[1]}`} style={{ width: '100%', height: 'auto', background: '#0A0A0A' }}>
        <defs>
          <radialGradient id="particleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C6FF00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C6FF00" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        <text x="20" y="35" fill="#F5F5F5" fontSize="20" fontWeight="600">{config.title || 'Particle Simulation'}</text>
        
        {effectiveParams.trail && particles.map((p, i) => (
          <circle key={`trail-${i}`} cx={p.x} cy={p.y} r="3" fill={p.color} opacity="0.3" />
        ))}
        
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="8" fill={p.color}>
            <animate attributeName="r" values="8;10;8" dur="1s" repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    )
  }

  const renderWaveViz = () => {
    const waves = effectiveParams.waves || [{ amplitude: 50, frequency: 1, wavelength: 150, phase: 0, color: '#C6FF00' }]
    const width = 800
    const height = 400
    const centerY = height / 2
    
    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', background: '#0A0A0A' }}>
        <text x="20" y="35" fill="#F5F5F5" fontSize="20" fontWeight="600">{config.title || 'Wave Motion'}</text>
        
        {effectiveParams.showGrid && (
          <>
            <line x1="0" y1={centerY} x2={width} y2={centerY} stroke="#333" strokeWidth="1" />
            {[0, 1, 2, 3, 4].map(i => (
              <line key={i} x1="0" y1={i * 100} x2={width} y2={i * 100} stroke="#222" strokeWidth="1" />
            ))}
          </>
        )}
        
        {waves.map((wave, wi) => {
          let pathD = ''
          for (let x = 0; x <= width; x += 5) {
            const y = centerY + wave.amplitude * Math.sin((2 * Math.PI * x) / wave.wavelength - (frame / 30) * wave.frequency + wave.phase)
            pathD += (x === 0 ? 'M' : 'L') + ` ${x} ${y}`
          }
          
          return (
            <g key={wi}>
              {effectiveParams.fill && (
                <path d={pathD + ` L ${width} ${centerY} L 0 ${centerY} Z`} fill={wave.color} opacity="0.2" />
              )}
              <path d={pathD} fill="none" stroke={wave.color} strokeWidth={3} />
            </g>
          )
        })}
      </svg>
    )
  }

  const renderCircuitViz = () => {
    const components = effectiveParams.circuitComponents || []
    const width = 800
    const height = 400
    
    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', background: '#0A0A0A' }}>
        <text x="20" y="35" fill="#F5F5F5" fontSize="20" fontWeight="600">{config.title || 'Circuit'}</text>
        
        {components.map((comp, i) => {
          if (comp.type === 'battery') {
            return (
              <g key={i}>
                <rect x={comp.pos[0] - 20} y={comp.pos[1] - 30} width="40" height="60" fill="none" stroke="#666" strokeWidth="2" />
                <text x={comp.pos[0]} y={comp.pos[1] + 5} fill="#F5F5F5" fontSize="12" textAnchor="middle">{comp.voltage}V</text>
                <text x={comp.pos[0]} y={comp.pos[1] - 40} fill="#FF6B6B" fontSize="10" textAnchor="middle">+</text>
              </g>
            )
          }
          if (comp.type === 'resistor') {
            return (
              <g key={i}>
                <rect x={comp.pos[0] - 25} y={comp.pos[1] - 10} width="50" height="20" fill="#8B4513" rx="2" />
                <text x={comp.pos[0]} y={comp.pos[1] + 20} fill="#A0A0A0" fontSize="10" textAnchor="middle">{comp.resistance}Ω</text>
              </g>
            )
          }
          if (comp.type === 'led') {
            return (
              <g key={i}>
                <polygon points={`${comp.pos[0]},${comp.pos[1]-15} ${comp.pos[0]-10},${comp.pos[1]+5} ${comp.pos[0]+10},${comp.pos[1]+5}`} fill="none" stroke={comp.color || '#FF0000'} strokeWidth="2" />
                <circle cx={comp.pos[0]} cy={comp.pos[1]} r="8" fill={comp.color || '#FF0000'} opacity={0.3 + 0.7 * Math.sin(frame / 10)} />
              </g>
            )
          }
          if (comp.type === 'wire' && comp.from && comp.to) {
            return (
              <path key={i} 
                d={comp.curve 
                  ? `M ${comp.from[0]} ${comp.from[1]} Q ${comp.curve[0]} ${comp.curve[1]} ${comp.to[0]} ${comp.to[1]}`
                  : `M ${comp.from[0]} ${comp.from[1]} L ${comp.to[0]} ${comp.to[1]}`
                } 
                fill="none" stroke="#C6FF00" strokeWidth="2" 
              />
            )
          }
          return null
        })}
        
        {effectiveParams.showCurrent && (
          <g>
            {[0, 1, 2, 3].map(i => {
              const offset = (frame * 2 + i * 50) % 400
              return (
                <circle key={i} cx={100 + offset} cy={250} r="4" fill="#C6FF00" opacity="0.8">
                  <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.5s" repeatCount="indefinite" />
                </circle>
              )
            })}
          </g>
        )}
      </svg>
    )
  }

  const renderMoleculeViz = () => {
    const atoms = effectiveParams.atoms || []
    const bonds = effectiveParams.bonds || []
    
    return (
      <svg viewBox="0 0 800 500" style={{ width: '100%', height: 'auto', background: '#0A0A0A' }}>
        <text x="20" y="35" fill="#F5F5F5" fontSize="20" fontWeight="600">{config.title || 'Molecule'}</text>
        
        {bonds.map((bond, i) => {
          const a1 = atoms[bond[0]]
          const a2 = atoms[bond[1]]
          if (!a1 || !a2) return null
          return (
            <line key={i} x1={a1.pos[0]} y1={a1.pos[1]} x2={a2.pos[0]} y2={a2.pos[1]} stroke="#666" strokeWidth="6" />
          )
        })}
        
        {atoms.map((atom, i) => {
          const rot = effectiveParams.animateRotation ? frame * 2 : 0
          return (
            <g key={i} transform={`rotate(${rot}, ${atom.pos[0]}, ${atom.pos[1]})`}>
              <circle cx={atom.pos[0]} cy={atom.pos[1]} r="25" fill={atom.color} stroke="#fff" strokeWidth="2" />
              <text x={atom.pos[0]} y={atom.pos[1] + 5} fill="#000" fontSize="14" fontWeight="bold" textAnchor="middle">{atom.element}</text>
            </g>
          )
        })}
      </svg>
    )
  }

  const renderGraphViz = () => {
    const functions = effectiveParams.functions || [{ eq: 'sin(x)', color: '#C6FF00', lineWidth: 3 }]
    const xRange = effectiveParams.xRange || [-10, 10]
    const yRange = effectiveParams.yRange || [-5, 5]
    const width = 800
    const height = 450
    const padding = 50
    
    const toScreenX = (x: number) => padding + ((x - xRange[0]) / (xRange[1] - xRange[0])) * (width - 2 * padding)
    const toScreenY = (y: number) => height - padding - ((y - yRange[0]) / (yRange[1] - yRange[0])) * (height - 2 * padding)
    
    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', background: '#0A0A0A' }}>
        <text x="20" y="35" fill="#F5F5F5" fontSize="20" fontWeight="600">{config.title || 'Function Graph'}</text>
        
        {effectiveParams.showGrid && (
          <>
            <line x1={padding} y1={toScreenY(0)} x2={width-padding} y2={toScreenY(0)} stroke="#444" strokeWidth="1" />
            <line x1={toScreenX(0)} y1={padding} x2={toScreenX(0)} y2={height-padding} stroke="#444" strokeWidth="1" />
          </>
        )}
        
        {functions.map((fn, fi) => {
          let pathD = ''
          const xStep = (xRange[1] - xRange[0]) / 200
          for (let x = xRange[0]; x <= xRange[1]; x += xStep) {
            let y = 0
            try {
              if (fn.eq.includes('sin')) y = Math.sin(x + (effectiveParams.animate ? frame / 20 : 0))
              else if (fn.eq.includes('cos')) y = Math.cos(x + (effectiveParams.animate ? frame / 20 : 0))
              else if (fn.eq.includes('x^2')) y = (x * x) / 20
              else if (fn.eq.includes('exp')) y = Math.exp(x / 5)
              else y = Math.sin(x)
            } catch {}
            
            if (y >= yRange[0] && y <= yRange[1]) {
              pathD += (x === xRange[0] ? 'M' : 'L') + ` ${toScreenX(x)} ${toScreenY(y)}`
            }
          }
          return <path key={fi} d={pathD} fill="none" stroke={fn.color} strokeWidth={fn.lineWidth} />
        })}
      </svg>
    )
  }

  const renderAstronomyViz = () => {
    const bodies = effectiveParams.bodies || []
    const centerX = 400
    const centerY = 250
    
    return (
      <svg viewBox="0 0 800 500" style={{ width: '100%', height: 'auto', background: '#0A0A0A' }}>
        <defs>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF7AD" />
            <stop offset="100%" stopColor="#FFD700" />
          </radialGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        <text x="20" y="35" fill="#F5F5F5" fontSize="20" fontWeight="600">{config.title || 'Astronomy'}</text>
        
        {effectiveParams.showOrbits && bodies.filter(b => b.type === 'planet').map((body, i) => (
          <circle key={`orbit-${i}`} cx={centerX} cy={centerY} r={body.orbit || 100} fill="none" stroke="#333" strokeDasharray="4" />
        ))}
        
        {bodies.map((body, i) => {
          if (body.type === 'star') {
            return (
              <g key={i}>
                <circle cx={body.pos?.[0] || centerX} cy={body.pos?.[1] || centerY} r={(body.radius || 50) + 20} fill="url(#glow)" />
                <circle cx={body.pos?.[0] || centerX} cy={body.pos?.[1] || centerY} r={body.radius || 50} fill="url(#sunGrad)" />
                <text x={(body.pos?.[0] || centerX) + 60} y={(body.pos?.[1] || centerY) + 5} fill="#FFD700" fontSize="12" fontWeight="bold">{body.name}</text>
              </g>
            )
          }
          
          const angle = (frame / 60) * (body.speed || 1) * Math.PI
          const orbitRadius = body.orbit || 100
          const parentPos = body.parent !== undefined ? bodies[body.parent]?.pos || [centerX, centerY] : [centerX, centerY]
          const x = (parentPos[0] || centerX) + orbitRadius * Math.cos(angle)
          const y = (parentPos[1] || centerY) + orbitRadius * Math.sin(angle)
          
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={body.radius || 15} fill={body.color || '#C6FF00'} />
              <text x={x + 20} y={y + 5} fill="#A0A0A0" fontSize="11">{body.name}</text>
            </g>
          )
        })}
      </svg>
    )
  }

  const renderBarViz = () => {
    const data = effectiveParams.data || [{ label: 'A', value: 50, color: '#C6FF00' }]
    const width = 800
    const height = 450
    const maxValue = Math.max(...data.map(d => d.value))
    const barWidth = (width - 100) / data.length - 20
    const maxHeight = height - 150
    const animatedHeight = Math.min(frame * 3, maxHeight)
    
    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', background: '#0A0A0A' }}>
        <text x="20" y="35" fill="#F5F5F5" fontSize="20" fontWeight="600">{config.title || 'Data'}</text>
        
        <line x1="50" y1={height - 80} x2={width - 30} y2={height - 80} stroke="#444" strokeWidth="2" />
        <line x1="50" y1={height - 80} x2="50" y2="80" stroke="#444" strokeWidth="2" />
        
        {data.map((d, i) => {
          const barH = (d.value / maxValue) * animatedHeight
          const x = 70 + i * (barWidth + 20)
          const y = height - 80 - barH
          
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={barH} fill={d.color} rx="4">
                {effectiveParams.animate && <animate attributeName="height" from="0" to={barH} dur="1s" fill="freeze" />}
                {effectiveParams.animate && <animate attributeName="y" from={height - 80} to={y} dur="1s" fill="freeze" />}
              </rect>
              <text x={x + barWidth/2} y={height - 55} fill="#A0A0A0" fontSize="14" textAnchor="middle">{d.label}</text>
              <text x={x + barWidth/2} y={y - 10} fill="#F5F5F5" fontSize="12" textAnchor="middle">{d.value}</text>
            </g>
          )
        })}
      </svg>
    )
  }

  const renderProcessViz = () => {
    const steps = effectiveParams.steps || []
    
    return (
      <svg viewBox="0 0 800 400" style={{ width: '100%', height: 'auto', background: '#0A0A0A' }}>
        <text x="20" y="35" fill="#F5F5F5" fontSize="20" fontWeight="600">{config.title || 'Process'}</text>
        
        {steps.map((step, i) => (
          <g key={i}>
            <circle cx={step.pos[0]} cy={step.pos[1]} r="35" fill={step.color} opacity="0.3" />
            <circle cx={step.pos[0]} cy={step.pos[1]} r="30" fill={step.color} />
            <text x={step.pos[0]} y={step.pos[1] + 5} fill="#000" fontSize="12" fontWeight="bold" textAnchor="middle">{step.label}</text>
          </g>
        ))}
        
        {effectiveParams.flow && steps.map((_, i) => {
          if (i >= steps.length - 1) return null
          const from = steps[i].pos
          const to = steps[i + 1].pos
          return (
            <g key={`flow-${i}`}>
              <line x1={from[0] + 40} y1={from[1]} x2={to[0] - 40} y2={to[1]} stroke="#C6FF00" strokeWidth="2" markerEnd="url(#arrow)" />
              {effectiveParams.animateFlow && (
                <circle r="6" fill="#C6FF00">
                  <animateMotion dur="2s" repeatCount="indefinite" path={`M ${from[0] + 40} ${from[1]} L ${to[0] - 40} ${to[1]}`} />
                </circle>
              )}
            </g>
          )
        })}
      </svg>
    )
  }

  const renderViz = () => {
    switch (config.type) {
      case 'particle': return renderParticleViz()
      case 'wave': return renderWaveViz()
      case 'circuit': return renderCircuitViz()
      case 'molecule': return renderMoleculeViz()
      case 'graph': return renderGraphViz()
      case 'astronomy': return renderAstronomyViz()
      case 'bar': return renderBarViz()
      case 'process': return renderProcessViz()
      default: return renderBarViz()
    }
  }

  return (
    <div className="my-6 rounded-md overflow-hidden border border-bg-tertiary bg-bg-secondary">
      <div className="flex items-center justify-between px-4 py-3 bg-bg-tertiary border-b border-bg-primary">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-accent uppercase">{config.type}</span>
          {isLoading && <span className="text-xs text-text-secondary">Loading...</span>}
        </div>
        <button onClick={() => setShowInfo(!showInfo)} className="text-xs text-text-secondary hover:text-text-primary">
          {showInfo ? 'Hide' : 'Info'}
        </button>
      </div>
      <div style={{ aspectRatio: '800/500' }}>
        {renderViz()}
      </div>
      {showInfo && (
        <div className="p-4 border-t border-bg-tertiary bg-bg-primary">
          <pre className="text-xs text-text-secondary font-mono overflow-x-auto">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
