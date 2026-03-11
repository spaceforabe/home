'use client'

import { useTrendStore } from '@/lib/trend-store'
import { BreadcrumbNav } from './breadcrumb-nav'
import { Settings, Search, Zap } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { setSourceSelectorOpen } = useTrendStore()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="absolute left-0 right-0 top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo & Breadcrumbs */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Trend<span className="text-primary">Pulse</span>
            </span>
          </div>
          <div className="hidden md:block">
            <BreadcrumbNav />
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country, city, or topic..."
              className="h-9 w-64 rounded-lg border border-border bg-secondary/50 pl-9 pr-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Time indicator */}
          <div className="hidden items-center gap-2 font-mono text-xs text-muted-foreground md:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span>Live</span>
          </div>

          {/* Sources Button */}
          <button
            onClick={() => setSourceSelectorOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card/80 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Sources</span>
          </button>
        </div>
      </div>

      {/* Mobile Breadcrumbs */}
      <div className="border-t border-border/30 px-6 py-2 md:hidden">
        <BreadcrumbNav />
      </div>
    </header>
  )
}
