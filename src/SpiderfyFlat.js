import Spiderfy from './Spiderfy';
import { calcAngleDegrees, generateLegImage } from './utils/helpers';

class SpiderfyFlat extends Spiderfy {
  _createSpiderfyLayers(layerId, features, clusterCoords) {
    const { circleSpiralSwitchover, spiderLegsAreHidden } = this.options;
    const drawCircle = features.length < circleSpiralSwitchover;
    const points = drawCircle ? this._calculatePointsInCircle(features.length) 
      : this._calculatePointsInSpiral(features.length);
    const spiderLegs = !spiderLegsAreHidden && this._generateLegs(points, drawCircle);
    
    this._drawFeaturesOnMap(points, spiderLegs, layerId, clusterCoords);
  }

  _generateLegs(points, drawCircle) {
    const { spiderLegsWidth, spiderLegsColor } = this.options;
    const legs = [];
    let legImg;

    points.forEach((point, index) => {
      if (!drawCircle || index === 0) {
        legImg = generateLegImage(
          [0, 0],
          point,
          spiderLegsWidth,
          spiderLegsColor,
        );
      }
      const leg = { img: legImg, rotation: 90 + calcAngleDegrees(point[0], point[1]) };
      legs.push(leg);
    });
    return legs;
  }

  _drawFeaturesOnMap(points, spiderLegs, layerId, coordinates) {
    const { layout, paint } = this.clickedParentClusterStyle;
    const { spiderLegsAreHidden, spiderLeavesLayout, spiderLeavesPaint } = this.options;

    points.forEach((point, index) => {
      const feature = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates },
        properties: this.spiderifiedCluster?.leaves[index]?.properties || {},
      };

      if (!spiderLegsAreHidden) {
        if (this.map.hasImage(`${layerId}-spiderfy-leg${index}`)) {
          this.map.removeImage(`${layerId}-spiderfy-leg${index}`);
        }
        this.map.addImage(`${layerId}-spiderfy-leg${index}`, spiderLegs[index].img);
        this.map.addLayer({
          id: `${layerId}-spiderfy-leg${index}`,
          type: 'symbol',
          source: {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [feature] },
          },
          layout: {
            'icon-image': `${layerId}-spiderfy-leg${index}`,
            'icon-allow-overlap': true,
            'icon-anchor': 'bottom',
            'icon-rotate': spiderLegs[index].rotation,
          },
        });
        this.activeSpiderfyLayerIds.push(`${layerId}-spiderfy-leg${index}`);
        this.map.moveLayer(`${layerId}-spiderfy-leg${index}`, layerId);
      }

      this.map.addLayer({
        id: `${layerId}-spiderfy-leaf${index}`,
        source: {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [feature] },
        },
        type: 'symbol',
        layout: {
          ...(spiderLeavesLayout),
          ...(!spiderLeavesLayout ? layout : {}),
          'icon-allow-overlap': true,
          'icon-offset': point,
        },
        paint: {
          ...(spiderLeavesPaint),
          ...(!spiderLeavesPaint ? paint : {}),
          ...(!spiderLeavesPaint && !spiderLeavesLayout && paint['icon-color'] 
            ? { 'icon-color': paint['icon-color'].toString() } : {})
        },
      });
      this.activeSpiderfyLayerIds.push(`${layerId}-spiderfy-leaf${index}`);
    })
  }

  _updateSpiderifiedClusterCoords() {
    if (!this.spiderifiedCluster) return;
    this.activeSpiderfyLayerIds.forEach((id) => {
      const { coordinates } = this.spiderifiedCluster.cluster.geometry;
      const source = this.map.getSource(id);

      source.setData({
        type: 'FeatureCollection', 
        features: [{
          type: 'Feature',
          geometry: { type: 'Point', coordinates },
        }],
      })
    })
  }
}

export default SpiderfyFlat;
