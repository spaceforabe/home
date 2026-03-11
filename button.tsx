'use client'

import { useTrendStore, type TrendTopic } from '@/lib/trend-store'
import { generateCountryTrends, getCountryEmoji } from '@/lib/mock-trends'
import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

function SentimentBar({ positive, neutral, negative }: { positive: number; neutral: number; negative: number }) {
  return (
    <div className="flex h-1.5 w-full overflow-hidden rounded-full">
      <div
        className="bg-sentiment-positive transition-all"
        style={{ width: `${positive}%` }}
      />
      <div
        className="bg-sentiment-neutral transition-all"
        style={{ width: `${neutral}%` }}
      />
      <div
        className="bg-sentiment-negative transition-all"
        style={{ width: `${negative}%` }}
      />
    </div>
  )
}

function Sparkline({ data, color = 'primary' }: { data: number[]; color?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * 60
      const y = 20 - ((val - min) / range) * 16
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width="60" height="24" className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className={cn(
          color === 'positive' && 'text-sentiment-positive',
          color === 'negative' && 'text-sentiment-negative',
          color === 'primary' && 'text-primary'
        )}
      />
    </svg>
  )
}

function VelocityBadge({ velocity, percent }: { velocity: 'rising' | 'falling' | 'stable'; percent: number }) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs',
        velocity === 'rising' && 'bg-sentiment-positive/20 text-sentiment-positive',
        velocity === 'falling' && 'bg-sentiment-negative/20 text-sentiment-negative',
        velocity === 'stable' && 'bg-muted text-muted-foreground'
      )}
    >
      {velocity === 'rising' && <TrendingUp className="h-3 w-3" />}
      {velocity === 'falling' && <TrendingDown className="h-3 w-3" />}
      {velocity === 'stable' && <Minus className="h-3 w-3" />}
      <span>{percent > 0 ? '+' : ''}{percent}%</span>
    </div>
  )
}

function TopicCard({ topic, rank, onClick }: { topic: TrendTopic; rank: number; onClick: () => void }) {
  const dominantSentiment = topic.sentiment.positive >= topic.sentiment.negative 
    ? (topic.sentiment.positive >= topic.sentiment.neutral ? 'positive' : 'neutral')
    : (topic.sentiment.negative >= topic.sentiment.neutral ? 'negative' : 'neutral')

  return (
    <button
      onClick={onClick}
      className="group w-full rounded-lg border border-border/50 bg-card/50 p-4 text-left transition-all hover:border-primary/50 hover:bg-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-secondary font-mono text-xs text-muted-foreground">
            #{rank}
          </span>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
              {topic.name}
            </h3>
            <div className="mt-1 flex items-center gap-2 font-mono text-sm text-muted-foreground">
              <span>{topic.volumeFormatted} mentions</span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1">
                {dominantSentiment === 'positive' && '😊'}
                {dominantSentiment === 'neutral' && '😐'}
                {dominantSentiment === 'negative' && '😟'}
                {topic.sentiment[dominantSentiment]}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <VelocityBadge velocity={topic.velocity} percent={topic.velocityPercent} />
          <Sparkline 
            data={topic.sparklineData} 
            color={topic.velocity === 'rising' ? 'positive' : topic.velocity === 'falling' ? 'negative' : 'primary'} 
          />
        </div>
      </div>

      <div className="mt-3">
        <SentimentBar {...topic.sentiment} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {topic.sources.slice(0, 3).map((source) => (
            <span
              key={source}
              className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
            >
              {source}
            </span>
          ))}
        </div>
        <span className="flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
          View details <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </button>
  )
}

export function TrendPanel() {
  const { 
    currentLocation, 
    isTrendPanelOpen, 
    setTrendPanelOpen, 
    setSelectedTopic,
    setTopicViewOpen,
  } = useTrendStore()
  
  const [trendData, setTrendData] = useState<ReturnType<typeof generateCountryTrends> | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    if (currentLocation.level === 'country') {
      const data = generateCountryTrends(currentLocation.code, currentLocation.name)
      setTrendData(data)
      setLastUpdated(new Date())
    }
  }, [currentLocation])

  const handleTopicClick = (topic: TrendTopic) => {
    setSelectedTopic(topic)
    setTopicViewOpen(true)
  }

  if (!isTrendPanelOpen || currentLocation.level === 'global') {
    return null
  }

  const emoji = getCountryEmoji(currentLocation.code)
  const timeSince = Math.floor((Date.now() - lastUpdated.getTime()) / 60000)

  return (
    <div className="absolute right-0 top-0 z-40 flex h-full w-full max-w-md flex-col border-l border-border/50 bg-background/95 backdrop-blur-md md:w-[420px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <span>{emoji}</span>
            <span>{currentLocation.name}</span>
            <span className="text-primary">— Trending Now</span>
          </h2>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            Updated {timeSince < 1 ? 'just now' : `${timeSince} min ago`}
          </p>
        </div>
        <button
          onClick={() => setTrendPanelOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Topics List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {trendData?.topics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              rank={index + 1}
              onClick={() => handleTopicClick(topic)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 px-6 py-4">
        <div className="flex items-center justify-between font-mono text-sm">
          <span className="text-muted-foreground">
            Total Volume: <span className="text-foreground">{trendData?.totalVolume.toLocaleString()}</span>
          </span>
          <button className="text-primary transition-colors hover:text-primary/80">
            Compare regions
          </button>
        </div>
      </div>
    </div>
  )
}
