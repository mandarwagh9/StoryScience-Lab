export default function LoadingIndicator() {
  return (
    <div className="py-12">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-3 h-3 bg-accent rounded-full animate-pulse-lime"></div>
        <div className="w-3 h-3 bg-accent rounded-full animate-pulse-lime" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 bg-accent rounded-full animate-pulse-lime" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <p className="text-text-secondary text-center">
        Generating explanation with visualizations...
      </p>
    </div>
  )
}
