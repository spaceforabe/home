'use client'

import { Header } from '@/components/header'
import { WorldMap } from '@/components/world-map'
import { TrendPanel } from '@/components/trend-panel'
import { SourceSelector } from '@/components/source-selector'
import { TopicView } from '@/components/topic-view'
import { useTrendStore } from '@/lib/trend-store'
import { useEffect, useState } from 'react'
import { globalTopTrends } from '@/lib/mock-trends'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

function GlobalTrendsBar() {
  const { currentLocation, isTrendPanelOpen } = useTrendStore()
  
  if (currentLocation.level !== 'global' || isTrendPanelOpen) return null

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-border/30 bg-background/80 backdrop-blur-md">
      <div className="px-6 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Global Top Trends
          </h3>
          <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Live updates
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {globalTopTrends.slice(0, 5).map((trend, i) => (
            <div
              key={trend.id}
              className="group flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 p-3 transition-all hover:border-primary/50 hover:bg-card"
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-secondary font-mono text-xs text-muted-foreground">
                #{i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">
                  {trend.name}
                </p>
                <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <span>{trend.volumeFormatted}</span>
                  <span
                    className={cn(
                      'flex items-center gap-0.5',
                      trend.velocity === 'rising' && 'text-sentiment-positive',
                      trend.velocity === 'falling' && 'text-sentiment-negative'
                    )}
                  >
                    {trend.velocity === 'rising' && <TrendingUp className="h-3 w-3" />}
                    {trend.velocity === 'falling' && <TrendingDown className="h-3 w-3" />}
                    {trend.velocity === 'stable' && <Minus className="h-3 w-3" />}
                    {trend.velocityPercent > 0 ? '+' : ''}
                    {trend.velocityPercent}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SpikeNotification() {
  const [visible, setVisible] = useState(false)
  const [notification, setNotification] = useState({ topic: '', location: '', percent: 0 })

  useEffect(() => {
    // Simulate a spike notification after 10 seconds
    const timer = setTimeout(() => {
      setNotification({
        topic: 'AI Revolution 2026',
        location: 'United States',
        percent: 340,
      })
      setVisible(true)

      // Hide after 5 seconds
      setTimeout(() => setVisible(false), 5000)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="absolute left-1/2 top-20 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-card/95 px-4 py-3 shadow-lg backdrop-blur-sm">
        <span className="text-lg">🔥</span>
        <div>
          <p className="text-sm font-medium text-foreground">
            <span className="text-primary">{notification.topic}</span> just spiked{' '}
            <span className="font-mono text-sentiment-positive">+{notification.percent}%</span>
          </p>
          <p className="text-xs text-muted-foreground">in {notification.location}</p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="ml-2 text-muted-foreground hover:text-foreground"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const { isTrendPanelOpen } = useTrendStore()

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      {/* Header */}
      <Header />

      {/* Map Container */}
      <div
        className={cn(
          'absolute inset-0 pt-16 transition-all duration-300 md:pt-16',
          isTrendPanelOpen && 'md:pr-[420px]'
        )}
      >
        <WorldMap />
      </div>

      {/* Global Trends Bar */}
      <GlobalTrendsBar />

      {/* Trend Panel (side drawer) */}
      <TrendPanel />

      {/* Source Selector Overlay */}
      <SourceSelector />

      {/* Topic Deep Dive View */}
      <TopicView />

      {/* Spike Notification */}
      <SpikeNotification />

      {/* Map Legend */}
      <div className="absolute bottom-24 left-6 z-30 hidden rounded-lg border border-border/50 bg-card/80 p-4 backdrop-blur-sm lg:block">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Activity Level
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-heat-high shadow-[0_0_8px_rgba(0,255,209,0.5)]" />
            <span className="font-mono text-xs text-foreground">High</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-heat-medium" />
            <span className="font-mono text-xs text-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-heat-low" />
            <span className="font-mono text-xs text-foreground">Low</span>
          </div>
        </div>
      </div>
    </main>
  )
}
