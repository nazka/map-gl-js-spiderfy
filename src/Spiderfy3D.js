import Spiderfy from './Spiderfy';

class Spiderfy3D extends Spiderfy {
  constructor(map, options) {
    super(map, options);
    this._points = [];
  }

  _createSpiderfyLayers(layerId, features, clusterCoords) {
    const drawCircle = features.length < this.options.circleSpiralSwitchover;
    this._points = drawCircle ? this._calculatePointsInCircle(features.length) 
      : this._calculatePointsInSpiral(features.length);
    const { spiderLeaves, spiderLegs } = this._generateFeatures(this._points, clusterCoords);
    
    this._drawFeaturesOnMap(spiderLeaves, spiderLegs, layerId);
  }

  _generateFeatures(points, clusterCoords) {
    const clusterXY = this.map.project(clusterCoords);
    const spiderLeaves = [];
    const spiderLegs = [];

    for (let i = 0; i < points.length; i += 1) {
      const spiderLeafLatLng = this.map.unproject([
        clusterXY.x + points[i][0],
        clusterXY.y + points[i][1],
      ]);
      
      spiderLeaves.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [spiderLeafLatLng.lng, spiderLeafLatLng.lat],
          properties: this.spiderifiedCluster?.leaves[i]?.properties || {},
        },
      });

      if (!this.options.spiderLegsAreHidden) {
        spiderLegs.push({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              clusterCoords,
              [spiderLeafLatLng.lng, spiderLeafLatLng.lat],
            ],
          },
        });
      }
    }
    return { spiderLeaves, spiderLegs };
  }

  _drawFeaturesOnMap(spiderLeaves, spiderLegs, layerId) {
    const { 
      spiderLegsWidth, spiderLegsColor, spiderLegsAreHidden, spiderLeavesLayout, spiderLeavesPaint,
    } = this.options;
    const { layout, paint } = this.clickedParentClusterStyle;

    if (!spiderLegsAreHidden) {
      spiderLegs.forEach((spiderLeg, index) => {
        this.map.addLayer({
          id: `${layerId}-spiderfy-leg${index}`,
          source: { 
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [spiderLeg] },
          },
          type: 'line',
          paint: {
            'line-width': spiderLegsWidth,
            'line-color': spiderLegsColor,
          },
        });
        this.activeSpiderfyLayerIds.push(`${layerId}-spiderfy-leg${index}`);
        this.map.moveLayer(`${layerId}-spiderfy-leg${index}`, layerId);
      });
    }

    spiderLeaves.forEach((spiderLeave, index) => {
      this.map.addLayer({
        id: `${layerId}-spiderfy-leaf${index}`,
        source: {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [spiderLeave] },
        },
        type: 'symbol',
        layout: {
          ...(spiderLeavesLayout),
          ...(spiderLeavesLayout ? layout : {}),
        },
        paint: {
          ...(spiderLeavesPaint),
          ...(spiderLeavesPaint || !spiderLeavesLayout ? paint : {}),
          ...(!spiderLeavesPaint && paint['icon-color'] 
            ? { 'icon-color': paint['icon-color'].toString() } : {})
        },
      });
      this.activeSpiderfyLayerIds.push(`${layerId}-spiderfy-leaf${index}`);
    })
  }

  _updateSpiderifiedClusterCoords() {
    if (!this.spiderifiedCluster) return;

    const { coordinates } = this.spiderifiedCluster.cluster.geometry;
    const clusterXY = this.map.project(coordinates);

    this.activeSpiderfyLayerIds.forEach((id) => {
      const source = this.map.getSource(id);
      const index = id.includes('-spiderfy-leaf') 
        ? id.substring(id.indexOf('-spiderfy-leaf') + 14)
        : id.substring(id.indexOf('-spiderfy-leg') + 13);
      const spiderLeafLatLng = this.map.unproject([
        clusterXY.x + this._points[index][0],
        clusterXY.y + this._points[index][1],
      ]);

      if (id.includes('-spiderfy-leaf')) {
        source.setData({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: { 
              type: 'Point',
              coordinates: [spiderLeafLatLng.lng, spiderLeafLatLng.lat],
            },
            properties: this.spiderifiedCluster?.leaves[index]?.properties || {},
          }],
        })
      } else {
        source.setData({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: { 
              type: 'LineString',
              coordinates: [
                coordinates,
                [spiderLeafLatLng.lng, spiderLeafLatLng.lat],
              ],
            },
          }],
        })
      }
    })
  }
}

export default Spiderfy3D;
