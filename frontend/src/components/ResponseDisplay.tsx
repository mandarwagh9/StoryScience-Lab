import CodeBlock from './CodeBlock'
import RemotionViz from './RemotionViz'

interface VizConfig {
  type: string
  title?: string
  params?: Record<string, any>
}

interface ResponsePart {
  type: 'text' | 'code' | 'visual'
  content?: string
  language?: string
  code?: string
  vizConfig?: VizConfig
}

interface ResponseDisplayProps {
  parts: ResponsePart[]
}

const vizTypeMapping: Record<string, string> = {
  'particle': 'projectile-motion',
  'wave': 'wave-motion',
  'circuit': 'process',
  'molecule': 'atom',
  'graph': 'wave-motion',
  'astronomy': 'solar-system',
  'bar': 'bar-chart',
  'process': 'process',
  'atom': 'atom',
  'pendulum': 'pendulum',
}

export default function ResponseDisplay({ parts }: ResponseDisplayProps) {
  return (
    <section className="animate-fade-in">
      <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-accent rounded-sm"></span>
        Explanation
      </h2>

      <div className="space-y-6">
        {parts.map((part, index) => {
          if (part.type === 'text') {
            return (
              <div 
                key={index} 
                className="text-text-primary leading-relaxed text-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {part.content?.split('\n\n').map((paragraph, pIndex) => (
                  <p key={pIndex} className="mb-4">
                    {paragraph.split('**').map((text, boldIndex) => 
                      boldIndex % 2 === 1 ? (
                        <strong key={boldIndex} className="text-accent font-semibold">{text}</strong>
                      ) : (
                        <span key={boldIndex}>{text}</span>
                      )
                    )}
                  </p>
                ))}
              </div>
            )
          }

          if (part.type === 'code' && part.code) {
            return (
              <div 
                key={index} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CodeBlock 
                  code={part.code} 
                  language={part.language || 'python'} 
                />
              </div>
            )
          }

          if (part.type === 'visual' && part.vizConfig) {
            const remotionVizType = vizTypeMapping[part.vizConfig.type] || 'bar-chart'
            return (
              <div 
                key={index} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <RemotionViz 
                  vizType={remotionVizType as any}
                  params={part.vizConfig.params || {}}
                  title={part.vizConfig.title}
                />
              </div>
            )
          }

          return null
        })}
      </div>
    </section>
  )
}
