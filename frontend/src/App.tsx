import { useState, useRef } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ResponseDisplay from './components/ResponseDisplay'
import LoadingIndicator from './components/LoadingIndicator'

interface VizConfig {
  type: string
  title?: string
  params: Record<string, any>
}

interface ResponsePart {
  type: 'text' | 'code' | 'visual'
  content?: string
  language?: string
  code?: string
  vizConfig?: VizConfig
}

const categories = [
  'Physics',
  'Chemistry', 
  'Biology',
  'Mathematics',
  'Computer Science',
  'Astronomy',
  'Environment'
]

function App() {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState<ResponsePart[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const responseRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || isLoading) return

    setIsLoading(true)
    setResponse([])

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: question.trim(),
          category: selectedCategory
        })
      })

      if (!res.ok) {
        throw new Error('Failed to get response')
      }

      const data = await res.json()
      
      const formattedResponse: ResponsePart[] = data.response.map((item: { type: string; content?: string; language?: string; code?: string; vizConfig?: VizConfig }) => ({
        type: item.type as 'text' | 'code' | 'visual',
        content: item.content,
        language: item.language,
        code: item.code,
        vizConfig: item.vizConfig
      }))

      setResponse(formattedResponse)
      
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error('Error:', error)
      setResponse([{ 
        type: 'text', 
        content: 'Sorry, something went wrong. Please try again.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header 
        categories={categories} 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <main className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        <Hero 
          question={question}
          onChangeQuestion={setQuestion}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {isLoading && <LoadingIndicator />}

        {!isLoading && response.length > 0 && (
          <div ref={responseRef}>
            <ResponseDisplay parts={response} />
          </div>
        )}

        {!isLoading && response.length === 0 && question && (
          <div className="mt-16 text-center text-text-secondary">
            <p>Press "Explain" to see the explanation</p>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 py-4 bg-bg-primary/80 backdrop-blur-sm border-t border-bg-tertiary">
        <div className="max-w-4xl mx-auto px-6 text-center text-text-secondary text-sm">
          StoryScience Lab — Powered by Gemini
        </div>
      </footer>
    </div>
  )
}

export default App
