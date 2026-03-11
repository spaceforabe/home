'use client'

import { useTrendStore, type FilterConfig } from '@/lib/trend-store'
import { X, Megaphone, Newspaper, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

const sourceIcons: Record<string, string> = {
  twitter: '𝕏',
  reddit: '🔗',
  tiktok: '♪',
  youtube: '▶',
  instagram: '📷',
  bluesky: '🦋',
  mastodon: '🐘',
  google: '🔍',
  rss: '📰',
}

const languages = [
  { value: 'all', label: 'All Languages' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'fr', label: 'French' },
  { value: 'ar', label: 'Arabic' },
  { value: 'zh', label: 'Mandarin' },
  { value: 'ja', label: 'Japanese' },
  { value: 'de', label: 'German' },
  { value: 'ko', label: 'Korean' },
]

const timeWindows: { value: FilterConfig['timeWindow']; label: string }[] = [
  { value: '1h', label: 'Last hour' },
  { value: '6h', label: 'Last 6 hours' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
]

const contentTypes: { value: FilterConfig['contentType']; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'text', label: 'Text' },
  { value: 'video', label: 'Video' },
  { value: 'images', label: 'Images' },
]

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'relative h-5 w-9 rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-secondary'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-4 w-4 rounded-full bg-foreground transition-transform',
          checked ? 'left-[18px]' : 'left-0.5'
        )}
      />
    </button>
  )
}

export function SourceSelector() {
  const { isSourceSelectorOpen, setSourceSelectorOpen, sources, toggleSource, filters, setFilter } =
    useTrendStore()

  if (!isSourceSelectorOpen) return null

  const socialSources = sources.filter((s) => s.category === 'social')
  const newsSources = sources.filter((s) => s.category === 'news')

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm"
        onClick={() => setSourceSelectorOpen(false)}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-border bg-background p-6 shadow-2xl md:w-[400px]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Data Sources</h2>
          <button
            onClick={() => setSourceSelectorOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Social Media Sources */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Megaphone className="h-4 w-4" />
            <span>Social Media</span>
          </div>
          <div className="space-y-3">
            {socialSources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{sourceIcons[source.icon] || '📱'}</span>
                  <span className="font-medium">{source.name}</span>
                </div>
                <ToggleSwitch checked={source.enabled} onChange={() => toggleSource(source.id)} />
              </div>
            ))}
          </div>
        </div>

        {/* News Sources */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Newspaper className="h-4 w-4" />
            <span>News & Media</span>
          </div>
          <div className="space-y-3">
            {newsSources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{sourceIcons[source.icon] || '📰'}</span>
                  <span className="font-medium">{source.name}</span>
                </div>
                <ToggleSwitch checked={source.enabled} onChange={() => toggleSource(source.id)} />
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </div>

          {/* Language */}
          <div className="mb-4">
            <label className="mb-2 block text-sm text-muted-foreground">Language</label>
            <select
              value={filters.language}
              onChange={(e) => setFilter('language', e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Window */}
          <div className="mb-4">
            <label className="mb-2 block text-sm text-muted-foreground">Time Window</label>
            <div className="grid grid-cols-2 gap-2">
              {timeWindows.map((tw) => (
                <button
                  key={tw.value}
                  onClick={() => setFilter('timeWindow', tw.value)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                    filters.timeWindow === tw.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tw.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">Content Type</label>
            <div className="grid grid-cols-4 gap-2">
              {contentTypes.map((ct) => (
                <button
                  key={ct.value}
                  onClick={() => setFilter('contentType', ct.value)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                    filters.contentType === ct.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary text-muted-foreground hover:text-foreground'
                  )}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Apply button */}
        <div className="mt-8 border-t border-border pt-6">
          <button
            onClick={() => setSourceSelectorOpen(false)}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Apply Changes
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Changes will re-query and refresh the map instantly
          </p>
        </div>
      </div>
    </>
  )
}
