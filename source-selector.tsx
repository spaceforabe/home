import { NextRequest, NextResponse } from 'next/server'

// Generate timeline data for sentiment over time
function generateSentimentTimeline() {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    positive: Math.floor(Math.random() * 60 + 20),
    neutral: Math.floor(Math.random() * 30 + 10),
    negative: Math.floor(Math.random() * 20 + 5),
  }))
}

// Generate volume data over time
function generateVolumeTimeline() {
  return Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 2}h`,
    volume: Math.floor(Math.random() * 500000 + 100000),
  }))
}

// Sample posts for a topic
function generateSamplePosts(topicName: string) {
  const sentiments = ['positive', 'neutral', 'negative'] as const
  const sources = ['Twitter', 'Reddit', 'YouTube', 'TikTok', 'News']
  
  return Array.from({ length: 5 }, (_, i) => ({
    id: `post-${i + 1}`,
    content: i === 0
      ? `Breaking: ${topicName} is trending worldwide! Here's what you need to know...`
      : i === 1
      ? `My thoughts on ${topicName} - this is a game changer for everyone involved.`
      : i === 2
      ? `Just saw the news about ${topicName}. What do you all think?`
      : i === 3
      ? `Expert analysis: The impact of ${topicName} on the global stage.`
      : `Community discussion thread: ${topicName} - share your experiences!`,
    source: sources[i % sources.length],
    timestamp: `${i + 1} hour${i > 0 ? 's' : ''} ago`,
    sentiment: sentiments[Math.floor(Math.random() * 3)],
    engagement: {
      likes: Math.floor(Math.random() * 10000),
      shares: Math.floor(Math.random() * 2000),
      comments: Math.floor(Math.random() * 500),
    },
  }))
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const geo = searchParams.get('geo') || 'GLOBAL'
  const window = searchParams.get('window') || '24h'

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 150))

  // Mock topic data based on ID patterns
  const topicNames: Record<string, string> = {
    'usa-1': 'AI Regulation Debate',
    'usa-2': 'Super Bowl LXII',
    'usa-3': 'Tech Layoffs Wave',
    'jpn-1': 'Cherry Blossom Season',
    'jpn-2': 'Bank of Japan Rate Decision',
    'jpn-3': 'Earthquake Warning System',
    'global-1': 'AI Revolution 2026',
    'global-2': 'Climate Emergency',
    'global-3': 'Global Elections',
  }

  const topicName = topicNames[id] || `Topic ${id}`
  
  const positive = Math.floor(Math.random() * 40 + 30)
  const negative = Math.floor(Math.random() * 25 + 10)
  const neutral = 100 - positive - negative

  const topicData = {
    id,
    name: topicName,
    geography: geo,
    timeWindow: window,
    volume: Math.floor(Math.random() * 5000000 + 500000),
    volumeFormatted: `${(Math.random() * 5 + 0.5).toFixed(1)}M`,
    velocity: Math.random() > 0.3 ? 'rising' : Math.random() > 0.5 ? 'falling' : 'stable',
    velocityPercent: Math.floor(Math.random() * 400 + 50),
    sentiment: {
      positive,
      neutral,
      negative,
    },
    sentimentTimeline: generateSentimentTimeline(),
    volumeTimeline: generateVolumeTimeline(),
    sourceBreakdown: [
      { name: 'Twitter', percentage: 35 },
      { name: 'Reddit', percentage: 25 },
      { name: 'YouTube', percentage: 20 },
      { name: 'TikTok', percentage: 12 },
      { name: 'News', percentage: 8 },
    ],
    keywords: [
      topicName.toLowerCase().replace(/\s+/g, ''),
      'trending',
      'viral',
      'breaking',
      '2026',
      'update',
    ],
    relatedTopics: [
      { id: 'related-1', name: 'Related Analysis', volume: 120000 },
      { id: 'related-2', name: 'Expert Opinions', volume: 85000 },
      { id: 'related-3', name: 'Historical Context', volume: 65000 },
    ],
    samplePosts: generateSamplePosts(topicName),
    lastUpdated: new Date().toISOString(),
  }

  return NextResponse.json(topicData)
}
