import { NextRequest, NextResponse } from 'next/server'

// Mock data for API responses
const countryTrendsData: Record<string, {
  topics: Array<{
    id: string
    name: string
    volume: number
    volumeFormatted: string
    sentiment: { positive: number; neutral: number; negative: number }
    sources: string[]
    velocity: 'rising' | 'falling' | 'stable'
    velocityPercent: number
    sparklineData: number[]
  }>
  totalVolume: number
  heatLevel: 'low' | 'medium' | 'high'
}> = {
  USA: {
    topics: [
      {
        id: 'usa-1',
        name: 'AI Regulation Debate',
        volume: 4200000,
        volumeFormatted: '4.2M',
        sentiment: { positive: 45, neutral: 35, negative: 20 },
        sources: ['Twitter', 'Reddit', 'YouTube'],
        velocity: 'rising',
        velocityPercent: 340,
        sparklineData: [30, 35, 42, 48, 55, 62, 70, 78, 85, 92, 98, 100],
      },
      {
        id: 'usa-2',
        name: 'Super Bowl LXII',
        volume: 3100000,
        volumeFormatted: '3.1M',
        sentiment: { positive: 72, neutral: 20, negative: 8 },
        sources: ['Twitter', 'TikTok', 'YouTube'],
        velocity: 'rising',
        velocityPercent: 520,
        sparklineData: [20, 25, 35, 45, 55, 65, 75, 85, 90, 95, 98, 100],
      },
      {
        id: 'usa-3',
        name: 'Tech Layoffs Wave',
        volume: 2800000,
        volumeFormatted: '2.8M',
        sentiment: { positive: 15, neutral: 40, negative: 45 },
        sources: ['Reddit', 'Twitter', 'News'],
        velocity: 'stable',
        velocityPercent: 5,
        sparklineData: [50, 52, 48, 51, 49, 52, 50, 48, 51, 49, 50, 51],
      },
    ],
    totalVolume: 15400000,
    heatLevel: 'high',
  },
  JPN: {
    topics: [
      {
        id: 'jpn-1',
        name: 'Cherry Blossom Season',
        volume: 2400000,
        volumeFormatted: '2.4M',
        sentiment: { positive: 78, neutral: 18, negative: 4 },
        sources: ['Twitter', 'YouTube'],
        velocity: 'rising',
        velocityPercent: 180,
        sparklineData: [40, 45, 52, 60, 68, 75, 82, 88, 92, 95, 97, 100],
      },
      {
        id: 'jpn-2',
        name: 'Bank of Japan Rate Decision',
        volume: 890000,
        volumeFormatted: '890K',
        sentiment: { positive: 22, neutral: 52, negative: 26 },
        sources: ['Twitter', 'News', 'Reddit'],
        velocity: 'stable',
        velocityPercent: -5,
        sparklineData: [55, 52, 54, 51, 53, 50, 52, 49, 51, 48, 50, 49],
      },
      {
        id: 'jpn-3',
        name: 'Earthquake Warning System',
        volume: 340000,
        volumeFormatted: '340K',
        sentiment: { positive: 25, neutral: 14, negative: 61 },
        sources: ['Twitter', 'News'],
        velocity: 'falling',
        velocityPercent: -15,
        sparklineData: [100, 95, 88, 82, 75, 70, 65, 60, 55, 52, 50, 48],
      },
    ],
    totalVolume: 5500000,
    heatLevel: 'medium',
  },
}

// Generate sparkline data
function generateSparkline(trend: 'rising' | 'falling' | 'stable'): number[] {
  const base = Math.random() * 50 + 25
  return Array.from({ length: 12 }, (_, i) => {
    const variance = Math.random() * 20 - 10
    if (trend === 'rising') return Math.round(base + i * 5 + variance)
    if (trend === 'falling') return Math.round(base + (12 - i) * 5 + variance)
    return Math.round(base + variance)
  })
}

// Generate default country data if not predefined
function generateDefaultCountryData(countryCode: string) {
  const topics = [
    { name: 'Local News', baseVolume: 500000 },
    { name: 'Sports Update', baseVolume: 300000 },
    { name: 'Weather Alert', baseVolume: 200000 },
  ].map((topic, i) => {
    const velocity: 'rising' | 'falling' | 'stable' = 
      i === 0 ? 'rising' : Math.random() > 0.5 ? 'falling' : 'stable'
    
    return {
      id: `${countryCode.toLowerCase()}-${i + 1}`,
      name: topic.name,
      volume: topic.baseVolume + Math.floor(Math.random() * 100000),
      volumeFormatted: topic.baseVolume >= 1000000 
        ? `${(topic.baseVolume / 1000000).toFixed(1)}M`
        : `${(topic.baseVolume / 1000).toFixed(0)}K`,
      sentiment: {
        positive: Math.round(Math.random() * 40 + 30),
        neutral: Math.round(Math.random() * 30 + 20),
        negative: Math.round(Math.random() * 20 + 10),
      },
      sources: ['Twitter', 'Reddit', 'News'].slice(0, Math.floor(Math.random() * 2) + 2),
      velocity,
      velocityPercent: velocity === 'rising' 
        ? Math.floor(Math.random() * 200 + 50)
        : velocity === 'falling'
        ? -Math.floor(Math.random() * 50 + 10)
        : Math.floor(Math.random() * 20 - 10),
      sparklineData: generateSparkline(velocity),
    }
  })

  const totalVolume = topics.reduce((sum, t) => sum + t.volume, 0)

  return {
    topics,
    totalVolume,
    heatLevel: totalVolume > 5000000 ? 'high' : totalVolume > 2000000 ? 'medium' : 'low' as const,
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const level = searchParams.get('level') || 'global'
  const code = searchParams.get('code')
  const sources = searchParams.get('sources')?.split(',') || []
  const window = searchParams.get('window') || '24h'

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100))

  if (level === 'global') {
    // Return global trends overview
    return NextResponse.json({
      level: 'global',
      regions: [
        { code: 'USA', name: 'United States', heatLevel: 'high', volume: 15400000 },
        { code: 'CHN', name: 'China', heatLevel: 'high', volume: 25600000 },
        { code: 'IND', name: 'India', heatLevel: 'high', volume: 20000000 },
        { code: 'BRA', name: 'Brazil', heatLevel: 'high', volume: 12500000 },
        { code: 'JPN', name: 'Japan', heatLevel: 'medium', volume: 5500000 },
        { code: 'GBR', name: 'United Kingdom', heatLevel: 'medium', volume: 8500000 },
        { code: 'DEU', name: 'Germany', heatLevel: 'medium', volume: 7000000 },
        { code: 'FRA', name: 'France', heatLevel: 'medium', volume: 7200000 },
      ],
      topTrends: [
        { id: 'global-1', name: 'AI Revolution 2026', volume: 45000000, volumeFormatted: '45M', velocity: 'rising', velocityPercent: 420 },
        { id: 'global-2', name: 'Climate Emergency', volume: 32000000, volumeFormatted: '32M', velocity: 'stable', velocityPercent: 12 },
        { id: 'global-3', name: 'Global Elections', volume: 28000000, volumeFormatted: '28M', velocity: 'rising', velocityPercent: 180 },
      ],
      lastUpdated: new Date().toISOString(),
    })
  }

  if (level === 'country' && code) {
    const data = countryTrendsData[code] || generateDefaultCountryData(code)
    
    return NextResponse.json({
      level: 'country',
      code,
      window,
      sources: sources.length > 0 ? sources : ['twitter', 'reddit', 'youtube', 'tiktok'],
      ...data,
      lastUpdated: new Date().toISOString(),
    })
  }

  return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 })
}
