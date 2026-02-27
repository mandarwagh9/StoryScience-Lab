export { ProjectileMotion } from './ProjectileMotion'
export { WaveMotion } from './WaveMotion'
export { SimpleHarmonicMotion } from './SimpleHarmonicMotion'
export { BarChart } from './BarChart'
export { SolarSystem } from './SolarSystem'
export { ProcessFlow } from './ProcessFlow'

export type VisualizationType = 
  | 'projectile-motion'
  | 'wave-motion'
  | 'pendulum'
  | 'bar-chart'
  | 'solar-system'
  | 'atom'
  | 'circuits'
  | 'process'

export const visualizationConfig: Record<VisualizationType, {
  durationInFrames: number
  fps: number
  width: number
  height: number
}> = {
  'projectile-motion': { durationInFrames: 300, fps: 30, width: 800, height: 500 },
  'wave-motion': { durationInFrames: 300, fps: 30, width: 800, height: 400 },
  'pendulum': { durationInFrames: 180, fps: 30, width: 800, height: 500 },
  'bar-chart': { durationInFrames: 120, fps: 30, width: 800, height: 500 },
  'solar-system': { durationInFrames: 600, fps: 30, width: 800, height: 500 },
  'atom': { durationInFrames: 300, fps: 30, width: 800, height: 500 },
  'circuits': { durationInFrames: 300, fps: 30, width: 800, height: 500 },
  'process': { durationInFrames: 180, fps: 30, width: 800, height: 500 },
}
