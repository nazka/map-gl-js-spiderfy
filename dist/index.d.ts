import type { Map, MapMouseEvent, GeoJSONFeature, SymbolLayerSpecification } from 'maplibre-gl';

declare module '@nazka/map-gl-js-spiderfy' {
  export interface SpiderfyOptions {
    onLeafClick?: (feature: GeoJSONFeature, event: MapMouseEvent) => void;
    onLeafHover?: (feature: GeoJSONFeature, event: MapMouseEvent) => void;
    minZoomLevel?: number;
    zoomIncrement?: number;
    closeOnLeafClick?: boolean;
    circleSpiralSwitchover?: number;
    circleOptions?: {
      leavesSeparation?: number;
      leavesOffset?: [number, number];
    }
    spiralOptions?: {
      legLengthStart?: number;
      legLengthFactor?: number;
      leavesSeparation?: number;
      leavesOffset?: [number, number];
    };
    spiderLegsAreHidden?: boolean;
    spiderLegsWidth?: number;
    spiderLegsColor?: string;
    spiderLeavesLayout?: SymbolLayerSpecification['layout'];
    spiderLeavesPaint?: SymbolLayerSpecification['paint'];
    maxLeaves?: number;
    renderMethod?: 'flat' | '3D';
  }

  export default class Spiderfy {
    constructor(
      map: Map, 
      options?: SpiderfyOptions,
    );
    applyTo(layerId: string): void;
    unspiderfyAll(): void;
  }
}
