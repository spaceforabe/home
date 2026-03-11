declare module 'react-simple-maps' {
  import { ComponentType, ReactNode, CSSProperties } from 'react'

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: {
      scale?: number
      center?: [number, number]
      rotate?: [number, number, number]
    }
    width?: number
    height?: number
    className?: string
    style?: CSSProperties
    children?: ReactNode
  }

  export interface ZoomableGroupProps {
    center?: [number, number]
    zoom?: number
    minZoom?: number
    maxZoom?: number
    onMoveStart?: (event: { coordinates: [number, number]; zoom: number }) => void
    onMove?: (event: { coordinates: [number, number]; zoom: number }) => void
    onMoveEnd?: (event: { coordinates: [number, number]; zoom: number }) => void
    children?: ReactNode
  }

  export interface GeographiesProps {
    geography: string | object
    children: (data: { geographies: Geography[] }) => ReactNode
  }

  export interface Geography {
    id: string
    rsmKey: string
    properties: {
      name: string
      [key: string]: unknown
    }
    geometry: object
  }

  export interface GeographyProps {
    geography: Geography
    style?: {
      default?: CSSProperties
      hover?: CSSProperties
      pressed?: CSSProperties
    }
    onClick?: (event: React.MouseEvent) => void
    onMouseEnter?: (event: React.MouseEvent) => void
    onMouseLeave?: (event: React.MouseEvent) => void
    className?: string
  }

  export interface MarkerProps {
    coordinates: [number, number]
    children?: ReactNode
    style?: {
      default?: CSSProperties
      hover?: CSSProperties
      pressed?: CSSProperties
    }
    onClick?: (event: React.MouseEvent) => void
  }

  export interface AnnotationProps {
    subject: [number, number]
    dx?: number
    dy?: number
    curve?: number
    children?: ReactNode
  }

  export interface LineProps {
    from: [number, number]
    to: [number, number]
    stroke?: string
    strokeWidth?: number
    strokeLinecap?: string
  }

  export interface GraticuleProps {
    stroke?: string
    strokeWidth?: number
    step?: [number, number]
  }

  export interface SphereProps {
    fill?: string
    stroke?: string
    strokeWidth?: number
  }

  export const ComposableMap: ComponentType<ComposableMapProps>
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>
  export const Geographies: ComponentType<GeographiesProps>
  export const Geography: ComponentType<GeographyProps>
  export const Marker: ComponentType<MarkerProps>
  export const Annotation: ComponentType<AnnotationProps>
  export const Line: ComponentType<LineProps>
  export const Graticule: ComponentType<GraticuleProps>
  export const Sphere: ComponentType<SphereProps>
}
