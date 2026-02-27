interface HeaderProps {
  categories: string[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

export default function Header({ categories, selectedCategory, onSelectCategory }: HeaderProps) {
  return (
    <header className="border-b border-bg-tertiary">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent flex items-center justify-center">
            <span className="text-bg-primary font-bold text-sm">SS</span>
          </div>
          <span className="font-semibold text-text-primary">StoryScience Lab</span>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(selectedCategory === category ? null : category)}
              className={`px-3 py-1.5 text-sm transition-all duration-200 rounded-sm
                ${selectedCategory === category 
                  ? 'bg-accent text-bg-primary font-medium' 
                  : 'text-text-secondary hover:text-accent'
                }`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
