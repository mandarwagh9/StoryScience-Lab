import { useCurrentFrame, useVideoConfig } from 'remotion'

interface VizParams {
  title?: string
  [key: string]: any
}

interface ScienceVizProps {
  type: string
  params: VizParams
}

export const ScienceViz: React.FC<ScienceVizProps> = ({ type, params }) => {
  switch (type) {
    case 'projectile':
      return <ProjectileMotion {...params} />
    case 'wave':
      return <WaveAnimation {...params} />
    case 'orbit':
      return <OrbitalMotion {...params} />
    case 'pendulum':
      return <SimplePendulum {...params} />
    case 'bar':
      return <BarGraph {...params} />
    case 'function':
      return <FunctionGraph {...params} />
    default:
      return <DefaultViz {...params} />
  }
}

const ProjectileMotion: React.FC<VizParams> = ({ 
  velocity = 60, 
  angle = 45, 
  gravity = 9.8,
  title = 'Projectile Motion'
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const t = frame / fps

  const angleRad = (angle * Math.PI) / 180
  const vx = velocity * Math.cos(angleRad)
  const vy = velocity * Math.sin(angleRad)

  const x = vx * t * 3
  const y = (vy * t - 0.5 * gravity * t * t) * 3

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#0A0A0A', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
        <text x="50" y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">{title}</text>
        <text x="50" y="70" fill="#A0A0A0" fontSize="14">v₀ = {velocity}m/s, θ = {angle}°, g = {gravity}m/s²</text>
        
        <line x1="50" y1="400" x2="750" y2="400" stroke="#444" strokeWidth="2" />
        <line x1="50" y1="400" x2="50" y2="50" stroke="#444" strokeWidth="2" />
        
        {y >= 0 && (
          <>
            <circle cx={50 + x} cy={400 - y} r="12" fill="#C6FF00" />
            <line x1={50 + x} y1={400} x2={50 + x} y2={400 - y} stroke="#C6FF00" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
            <text x={60 + x} y={380 - y} fill="#C6FF00" fontSize="12">h = {Math.max(0, y/3).toFixed(1)}m</text>
          </>
        )}
        
        <text x="700" y="430" fill="#666" fontSize="12">Distance</text>
        <text x="20" y="60" fill="#666" fontSize="12">Height</text>
      </svg>
    </div>
  )
}

const WaveAnimation: React.FC<VizParams> = ({ 
  amplitude = 50, 
  frequency = 1,
  wavelength = 150,
  title = 'Wave Motion'
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  
  const points: string[] = []
  for (let x = 0; x <= 700; x += 5) {
    const phase = (2 * Math.PI * x) / wavelength
    const y = amplitude * Math.sin(phase - (frame / fps) * frequency * 2 * Math.PI)
    points.push(`${x + 50},${150 + y}`)
  }

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#0A0A0A', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
        <text x="50" y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">{title}</text>
        <text x="50" y="70" fill="#A0A0A0" fontSize="14">Amplitude: {amplitude}px | Frequency: {frequency}Hz | λ: {wavelength}px</text>
        
        <line x1="50" y1="150" x2="750" y2="150" stroke="#333" />
        <line x1="50" y1="50" x2="50" y2="250" stroke="#333" />
        
        <polygon points={`50,150 ${points.join(' ')} 750,150`} fill="#C6FF00" opacity="0.2" />
        <polyline points={points.join(' ')} fill="none" stroke="#C6FF00" strokeWidth="3" />
        
        <text x="50" y="300" fill="#A0A0A0" fontSize="14">Wavelength (λ) = {wavelength}px</text>
        <text x="50" y="330" fill="#C6FF00" fontSize="14">Amplitude = {amplitude}px</text>
      </svg>
    </div>
  )
}

const OrbitalMotion: React.FC<VizParams> = ({ 
  bodies = ['Mercury', 'Venus', 'Earth', 'Mars'],
  speeds = [4.7, 3.5, 2.9, 2.4],
  title = 'Orbital Motion'
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const time = frame / fps

  const planetBodies = typeof bodies === 'string' ? JSON.parse(bodies) : bodies
  const planetSpeeds = typeof speeds === 'string' ? JSON.parse(speeds) : speeds

  const planets = (Array.isArray(planetBodies) ? planetBodies : []).map((name: string, i: number) => ({
    name,
    r: 40 + i * 45,
    size: 5 + (4 - i) * 2,
    speed: Array.isArray(planetSpeeds) ? (planetSpeeds[i] || 2) : 2
  }))

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#0A0A0A', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
        <text x="50" y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">{title}</text>
        
        <circle cx="400" cy="250" r="25" fill="#FFD700" />
        <text x="430" y="255" fill="#B8860B" fontSize="12" fontWeight="bold">Sun</text>
        
        {planets.map((p, i) => (
          <circle key={i} cx="400" cy="250" r={p.r} fill="none" stroke="#333" strokeDasharray="4" />
        ))}
        
        {planets.map((p, i) => {
          const angle = (time * p.speed * Math.PI) / 30
          const x = 400 + p.r * Math.cos(angle)
          const y = 250 + p.r * Math.sin(angle)
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={p.size} fill="#C6FF00" />
              <text x={x + p.size + 5} y={y + 4} fill="#A0A0A0" fontSize="10">{p.name}</text>
            </g>
          )
        })}
        
        <text x="50" y="450" fill="#A0A0A0" fontSize="12">Inner planets orbit faster due to stronger gravity</text>
      </svg>
    </div>
  )
}

const SimplePendulum: React.FC<VizParams> = ({ 
  length = 150, 
  gravity = 9.8,
  title = 'Simple Pendulum'
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  
  const angularFreq = Math.sqrt(gravity / (length / 100))
  const angle = 0.5 * Math.sin(angularFreq * (frame / fps))
  
  const bobX = 400 + length * Math.sin(angle)
  const bobY = 100 + length * Math.cos(angle)

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#0A0A0A', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
        <text x="50" y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">{title}</text>
        <text x="50" y="70" fill="#A0A0A0" fontSize="14">Length: {length}cm | g = {gravity}m/s² | Period: {(2 * Math.PI * Math.sqrt(length/100/gravity)).toFixed(2)}s</text>
        
        <rect x="350" y="50" width="100" height="15" fill="#333" rx="4" />
        <line x1="400" y1="65" x2="400" y2="100" stroke="#666" strokeWidth="4" />
        <circle cx="400" cy="65" r="6" fill="#666" />
        
        <line x1="400" y1="100" x2={bobX} y2={bobY} stroke="#A0A0A0" strokeWidth="2" />
        <circle cx={bobX} cy={bobY} r="20" fill="#C6FF00" />
        
        <text x="50" y="350" fill="#C6FF00" fontSize="14">ω = √(g/L) = {angularFreq.toFixed(2)} rad/s</text>
        <text x="50" y="380" fill="#F5F5F5" fontSize="14">θ(t) = θ₀ × sin(ωt)</text>
      </svg>
    </div>
  )
}

const BarGraph: React.FC<VizParams> = ({ 
  data = [],
  title = 'Data Visualization'
}) => {
  const frame = useCurrentFrame()
  
  const defaultData = [
    { label: 'A', value: 80 },
    { label: 'B', value: 45 },
    { label: 'C', value: 70 },
    { label: 'D', value: 55 },
    { label: 'E', value: 90 },
  ]
  
  const chartData = (Array.isArray(data) && data.length > 0) ? data : defaultData
  const maxValue = Math.max(...(chartData as any[]).map((d: any) => d.value))

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#0A0A0A', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
        <text x="50" y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">{title}</text>
        
        <line x1="100" y1="400" x2="700" y2="400" stroke="#333" strokeWidth="2" />
        <line x1="100" y1="400" x2="100" y2="100" stroke="#333" strokeWidth="2" />
        
        {chartData.map((d: any, i: number) => {
          const barHeight = (d.value / maxValue) * 250
          const animatedHeight = Math.min(frame * 4, barHeight)
          const x = 130 + i * 100
          
          return (
            <g key={i}>
              <rect
                x={x}
                y={400 - animatedHeight}
                width="60"
                height={animatedHeight}
                fill="#C6FF00"
                rx="4"
              />
              <text x={x + 30} y="425" fill="#A0A0A0" fontSize="14" textAnchor="middle">{d.label}</text>
              <text x={x + 30} y={400 - animatedHeight - 10} fill="#F5F5F5" fontSize="12" textAnchor="middle">{d.value}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

const FunctionGraph: React.FC<VizParams> = ({ 
  equation = 'sin(x)',
  title = 'Function Graph'
}) => {
  const points: string[] = []
  for (let x = 0; x <= 700; x += 3) {
    const xVal = (x / 700) * 4 * Math.PI
    let yVal = Math.sin(xVal)
    if (equation.includes('cos')) yVal = Math.cos(xVal)
    if (equation.includes('tan')) yVal = Math.tan(xVal) / 3
    const y = 200 - yVal * 80
    points.push(`${x + 50},${y}`)
  }

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#0A0A0A', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
        <text x="50" y="40" fill="#F5F5F5" fontSize="20" fontFamily="system-ui">{title}: f(x) = {equation}</text>
        
        <line x1="50" y1="200" x2="750" y2="200" stroke="#333" strokeWidth="1" />
        <line x1="400" y1="50" x2="400" y2="350" stroke="#333" strokeWidth="1" />
        
        <polyline points={points.join(' ')} fill="none" stroke="#C6FF00" strokeWidth="2" />
        
        <text x="720" y="210" fill="#666" fontSize="12">x</text>
        <text x="410" y="55" fill="#666" fontSize="12">y</text>
      </svg>
    </div>
  )
}

const DefaultViz: React.FC<VizParams> = ({ title = 'Visualization' }) => {
  const frame = useCurrentFrame()
  
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#0A0A0A', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="60%" height="60%" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r={100 + Math.sin(frame * 0.05) * 20} fill="none" stroke="#C6FF00" strokeWidth="3" opacity="0.5" />
        <circle cx="200" cy="200" r={60 + Math.cos(frame * 0.05) * 15} fill="none" stroke="#C6FF00" strokeWidth="2" />
        <circle cx="200" cy="200" r="30" fill="#C6FF00" />
        <text x="200" y="380" fill="#F5F5F5" fontSize="16" textAnchor="middle">{title}</text>
      </svg>
    </div>
  )
}
