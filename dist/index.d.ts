import type { Map, MapMouseEvent, GeoJSONFeature } from 'maplibre-gl';

declare module '@nazka/map-gl-js-spiderfy' {
  export interface SpiderfyOptions {
    minZoomLevel?: number;
    zoomIncrement?: number;
    circleSpiralSwitchover?: number;
    circleFootSeparation?: number;
    spiralFootSeparation?: number;
    spiralLengthStart?: number;
    spiralLengthFactor?: number;
    animate?: boolean;
    animationSpeed?: number;
    legWeight?: number;
    legColor?: string;
    onLeafClick?: (feature: GeoJSONFeature, event: MapMouseEvent) => void;
  }

  export default class Spiderfy {
    constructor(map: Map, options?: SpiderfyOptions);
    applyTo(layerId: string): void;
    unspiderfyAll(): void;
  }
}
