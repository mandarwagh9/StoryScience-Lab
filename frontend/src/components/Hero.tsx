interface HeroProps {
  question: string
  onChangeQuestion: (question: string) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}

export default function Hero({ question, onChangeQuestion, onSubmit, isLoading }: HeroProps) {
  return (
    <section className="py-16 md:py-24">
      <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4 leading-tight">
        Understand Science
        <br />
        <span className="text-accent">Visually</span>
      </h1>
      
      <p className="text-lg text-text-secondary mb-10 max-w-xl">
        Ask any STEM question and receive interactive explanations with text and AI-generated visualizations.
      </p>

      <form onSubmit={onSubmit} className="w-full max-w-2xl">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => onChangeQuestion(e.target.value)}
            placeholder="Ask a science question..."
            disabled={isLoading}
            className="w-full bg-bg-secondary border border-bg-tertiary text-text-primary px-5 py-4 pr-36 
              text-lg rounded-md transition-all duration-200
              placeholder:text-text-secondary/50
              focus:border-accent
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 
              bg-accent text-bg-primary font-semibold px-6 py-2 rounded-sm
              transition-all duration-200
              hover:bg-accent-hover
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent
              active:scale-[0.98]"
          >
            {isLoading ? 'Generating...' : 'Explain'}
          </button>
        </div>
        
        <p className="mt-4 text-sm text-text-secondary/60">
          Try: "Explain quantum entanglement" or "How does photosynthesis work?"
        </p>
      </form>
    </section>
  )
}
