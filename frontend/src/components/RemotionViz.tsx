import { useState, useEffect } from 'react'
import { Player } from '@remotion/player'
import { Eye, Loader2 } from 'lucide-react'
import {
  ProjectileMotion,
  WaveMotion,
  SimpleHarmonicMotion,
  BarChart,
  SolarSystem,
  visualizationConfig,
  VisualizationType
} from './visualizations'

interface RemotionVizProps {
  vizType: VisualizationType
  params?: Record<string, any>
  title?: string
  autoPlay?: boolean
}

const visualizationComponents: Record<VisualizationType, React.FC<any>> = {
  'projectile-motion': ProjectileMotion,
  'wave-motion': WaveMotion,
  'pendulum': SimpleHarmonicMotion,
  'bar-chart': BarChart,
  'solar-system': SolarSystem,
  'atom': ProjectileMotion,
  'circuits': WaveMotion,
}

export default function RemotionViz({ vizType, params = {}, title, autoPlay = true }: RemotionVizProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showCode, setShowCode] = useState(false)

  const config = visualizationConfig[vizType] || visualizationConfig['bar-chart']
  const Component = visualizationComponents[vizType] || BarChart

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="my-6 rounded-md overflow-hidden border border-bg-tertiary bg-bg-secondary">
      <div className="flex items-center justify-between px-4 py-3 bg-bg-tertiary border-b border-bg-primary">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-text-primary capitalize">
            {vizType.replace('-', ' ')} Animation
          </span>
          {isLoading && (
            <span className="text-xs text-text-secondary flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" />
              Loading...
            </span>
          )}
        </div>
        
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <Eye size={14} />
          {showCode ? 'Hide' : 'Details'}
        </button>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-secondary z-10" style={{minHeight: '300px'}}>
            <div className="flex items-center gap-2">
              <Loader2 size={24} className="text-accent animate-spin" />
              <span className="text-text-secondary">Preparing animation...</span>
            </div>
          </div>
        )}
        
        <div style={{ width: '100%', aspectRatio: `${config.width}/${config.height}` }}>
          <Player
            component={Component}
            durationInFrames={config.durationInFrames}
            fps={config.fps}
            compositionWidth={config.width}
            compositionHeight={config.height}
            autoPlay={autoPlay}
            loop
            inputProps={{ ...params, title }}
          />
        </div>
      </div>

      {showCode && (
        <div className="p-4 border-t border-bg-tertiary bg-bg-primary">
          <pre className="text-xs text-text-secondary font-mono overflow-x-auto">
            {JSON.stringify({ type: vizType, params, title }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
