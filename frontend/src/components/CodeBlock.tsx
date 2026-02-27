import { useState, useEffect } from 'react'
import { Eye, Loader2, Image as ImageIcon, ChevronUp } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language: string
  autoRun?: boolean
}

let pyodideInstance: any = null
let isLoadingPyodide = false

async function loadPyodide() {
  if (pyodideInstance) return pyodideInstance
  if (isLoadingPyodide) {
    while (isLoadingPyodide) {
      await new Promise(r => setTimeout(r, 100))
    }
    return pyodideInstance
  }
  
  isLoadingPyodide = true
  try {
    const { loadPyodide: loadPyodideFn } = await import('pyodide')
    pyodideInstance = await loadPyodideFn({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'
    })
    await pyodideInstance.loadPackage(['numpy', 'matplotlib'])
    return pyodideInstance
  } catch (e) {
    console.error('Failed to load Pyodide:', e)
    return null
  } finally {
    isLoadingPyodide = false
  }
}

export default function CodeBlock({ code, language, autoRun = true }: CodeBlockProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isPyodideLoading, setIsPyodideLoading] = useState(true)
  const [pyodideReady, setPyodideReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCode, setShowCode] = useState(false)

  useEffect(() => {
    const initPyodide = async () => {
      const pyodide = await loadPyodide()
      if (pyodide) {
        setPyodideReady(true)
        if (autoRun) {
          runCode(pyodide)
        }
      }
      setIsPyodideLoading(false)
    }
    initPyodide()
  }, [])

  const runCode = async (pyodideInstance?: any) => {
    if (language !== 'python') return

    setIsRunning(true)
    setError(null)

    try {
      const pyodide = pyodideInstance || await loadPyodide()
      if (!pyodide) {
        setError('Failed to load Python')
        setIsRunning(false)
        return
      }

      let capturedOutput = ''
      let capturedError = ''
      
      pyodide.setStdout({
        batched: (text: string) => {
          capturedOutput += text + '\n'
        }
      })

      pyodide.setStderr({
        batched: (text: string) => {
          capturedError += text + '\n'
        }
      })

      await pyodide.runPythonAsync(code)
      
      const finalOutput = capturedOutput.trim()
      
      if (finalOutput.startsWith('VISUAL:')) {
        const base64Data = finalOutput.replace('VISUAL:', '').trim()
        const dataUrl = `data:image/png;base64,${base64Data}`
        setImageUrl(dataUrl)
      } else if (capturedError) {
        setError(capturedError)
      }
      
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="my-6 rounded-md overflow-hidden border border-bg-tertiary bg-bg-secondary">
      <div className="flex items-center justify-between px-4 py-3 bg-bg-tertiary border-b border-bg-primary">
        <div className="flex items-center gap-3">
          <ImageIcon size={16} className="text-accent" />
          <span className="text-sm font-medium text-text-primary">Interactive Visualization</span>
          {isPyodideLoading && (
            <span className="text-xs text-text-secondary">Loading...</span>
          )}
          {pyodideReady && !isRunning && !imageUrl && !error && (
            <button 
              onClick={() => runCode()}
              className="text-xs text-accent hover:underline cursor-pointer"
            >
              Click to generate
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          {showCode ? <ChevronUp size={14} /> : <Eye size={14} />}
          {showCode ? 'Hide' : 'View'} Code
        </button>
      </div>

      {showCode && (
        <div className="overflow-x-auto border-b border-bg-tertiary">
          <pre className="p-4 text-sm text-text-secondary font-mono leading-relaxed opacity-60">
            <code>{code}</code>
          </pre>
        </div>
      )}

      {isRunning && (
        <div className="p-8 flex items-center justify-center gap-3">
          <Loader2 size={24} className="text-accent animate-spin" />
          <span className="text-text-secondary">Generating visualization...</span>
        </div>
      )}

      {imageUrl && (
        <div className="p-4 bg-white">
          <img
            src={imageUrl}
            alt="Generated visualization"
            className="max-w-full h-auto rounded"
          />
        </div>
      )}

      {error && (
        <div className="p-4">
          <pre className="text-sm text-error font-mono">{error}</pre>
        </div>
      )}
    </div>
  )
}
