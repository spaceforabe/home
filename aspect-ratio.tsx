'use client'

import { useTrendStore } from '@/lib/trend-store'
import { getCountryEmoji } from '@/lib/mock-trends'
import { ChevronRight } from 'lucide-react'

export function BreadcrumbNav() {
  const { breadcrumbs, navigateToGlobal, navigateTo } = useTrendStore()

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      navigateToGlobal()
    } else {
      const location = breadcrumbs[index]
      // Navigate to that location
      navigateTo(location)
    }
  }

  return (
    <nav className="flex items-center gap-1 font-mono text-sm">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1
        const emoji = crumb.level === 'global' ? '🌍' : getCountryEmoji(crumb.code)

        return (
          <div key={`${crumb.code}-${index}`} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <button
              onClick={() => handleBreadcrumbClick(index)}
              disabled={isLast}
              className={`flex items-center gap-1.5 rounded px-2 py-1 transition-colors ${
                isLast
                  ? 'cursor-default text-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <span>{emoji}</span>
              <span>{crumb.name}</span>
            </button>
          </div>
        )
      })}
    </nav>
  )
}
