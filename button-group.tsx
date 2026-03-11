'use client'

import { useTrendStore } from '@/lib/trend-store'
import { getCountryEmoji } from '@/lib/mock-trends'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const generateTimelineData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    positive: Math.floor(Math.random() * 60 + 20),
    neutral: Math.floor(Math.random() * 30 + 10),
    negative: Math.floor(Math.random() * 20 + 5),
  }))
}

const generateVolumeData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 2}h`,
    volume: Math.floor(Math.random() * 500000 + 100000),
  }))
}

export function TopicView() {
  const { selectedTopic, currentLocation, isTopicViewOpen, setTopicViewOpen, setSelectedTopic } =
    useTrendStore()

  if (!isTopicViewOpen || !selectedTopic) return null

  const emoji = getCountryEmoji(currentLocation.code)
  const timelineData = generateTimelineData()
  const volumeData = generateVolumeData()

  const sourceData = selectedTopic.sources.map((source, i) => ({
    name: source,
    value: Math.floor(100 / selectedTopic.sources.length) + (i === 0 ? 100 % selectedTopic.sources.length : 0),
  }))

  const COLORS = ['#00FFD1', '#FFAA00', '#FF6B6B', '#4ECDC4', '#9B59B6']

  const handleClose = () => {
    setTopicViewOpen(false)
    setSelectedTopic(null)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{selectedTopic.name}</h1>
              <span
                className={cn(
                  'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                  selectedTopic.velocity === 'rising' && 'bg-sentiment-positive/20 text-sentiment-positive',
                  selectedTopic.velocity === 'falling' && 'bg-sentiment-negative/20 text-sentiment-negative',
                  selectedTopic.velocity === 'stable' && 'bg-muted text-muted-foreground'
                )}
              >
                {selectedTopic.velocity === 'rising' && <TrendingUp className="h-3 w-3" />}
                {selectedTopic.velocity === 'falling' && <TrendingDown className="h-3 w-3" />}
                {selectedTopic.velocity === 'stable' && <Minus className="h-3 w-3" />}
                {selectedTopic.velocityPercent > 0 ? '+' : ''}
                {selectedTopic.velocityPercent}%
              </span>
            </div>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              {emoji} {currentLocation.name} • Last 24 hours • {selectedTopic.volumeFormatted} mentions
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sentiment Timeline */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Sentiment Over Time</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <XAxis
                      dataKey="hour"
                      tick={{ fill: '#666', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#666', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a2035',
                        border: '1px solid #2a3045',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="positive"
                      stackId="1"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="neutral"
                      stackId="1"
                      stroke="#eab308"
                      fill="#eab308"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="negative"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-sentiment-positive" />
                  <span className="text-muted-foreground">Positive</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-sentiment-neutral" />
                  <span className="text-muted-foreground">Neutral</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-sentiment-negative" />
                  <span className="text-muted-foreground">Negative</span>
                </div>
              </div>
            </section>

            {/* Volume Chart */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Mention Volume</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData}>
                    <XAxis
                      dataKey="time"
                      tick={{ fill: '#666', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#666', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a2035',
                        border: '1px solid #2a3045',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#fff' }}
                      formatter={(v: number) => [v.toLocaleString(), 'Mentions']}
                    />
                    <Bar dataKey="volume" fill="#00FFD1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Sample Posts */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Sample Posts</h2>
              <div className="space-y-4">
                {selectedTopic.samplePosts?.map((post, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border/50 bg-secondary/30 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-card px-2 py-0.5 text-xs font-medium">
                          {post.source}
                        </span>
                        <span
                          className={cn(
                            'h-2 w-2 rounded-full',
                            post.sentiment === 'positive' && 'bg-sentiment-positive',
                            post.sentiment === 'neutral' && 'bg-sentiment-neutral',
                            post.sentiment === 'negative' && 'bg-sentiment-negative'
                          )}
                        />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        {post.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90">{post.content}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Sentiment Breakdown */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Sentiment Breakdown</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-sentiment-positive" />
                    <span className="text-sm">Positive</span>
                  </div>
                  <span className="font-mono text-sm font-medium">
                    {selectedTopic.sentiment.positive}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-sentiment-positive transition-all"
                    style={{ width: `${selectedTopic.sentiment.positive}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-sentiment-neutral" />
                    <span className="text-sm">Neutral</span>
                  </div>
                  <span className="font-mono text-sm font-medium">
                    {selectedTopic.sentiment.neutral}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-sentiment-neutral transition-all"
                    style={{ width: `${selectedTopic.sentiment.neutral}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-sentiment-negative" />
                    <span className="text-sm">Negative</span>
                  </div>
                  <span className="font-mono text-sm font-medium">
                    {selectedTopic.sentiment.negative}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-sentiment-negative transition-all"
                    style={{ width: `${selectedTopic.sentiment.negative}%` }}
                  />
                </div>
              </div>
            </section>

            {/* Source Breakdown */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Source Distribution</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {sourceData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a2035',
                        border: '1px solid #2a3045',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {sourceData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Keywords */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Related Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {selectedTopic.keywords?.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-border bg-secondary px-3 py-1 text-sm text-foreground"
                  >
                    #{keyword}
                  </span>
                ))}
                <span className="rounded-full border border-border bg-secondary px-3 py-1 text-sm text-foreground">
                  #{selectedTopic.name.toLowerCase().replace(/\s+/g, '')}
                </span>
              </div>
            </section>

            {/* Related Topics */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Related Topics</h2>
              <div className="space-y-2">
                {['Global Response', 'Expert Analysis', 'Historical Context'].map((topic) => (
                  <button
                    key={topic}
                    className="flex w-full items-center justify-between rounded-lg border border-border/50 bg-secondary/30 px-4 py-3 text-sm transition-colors hover:bg-secondary"
                  >
                    <span>{topic}</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
