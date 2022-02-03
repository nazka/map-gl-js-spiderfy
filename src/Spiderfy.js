import defaultOptions from './constants/default-options';
import { findAsync, getClusterLeavesAsync } from './utils/helpers';

class Spiderfy {
  constructor(map, options) {
    this.map = map;
    this.activeSpiderfyLayerIds = [];
    this.spiderifiedCluster = null;
    this.clickedParentClusterStyle = null;
    this.options = { 
      ...defaultOptions, 
      ...(options || {}),
      circleOptions: {
        ...defaultOptions.circleOptions, 
        ...(options?.circleOptions || {}),
      },
      spiralOptions: {
        ...defaultOptions.spiralOptions, 
        ...(options?.spiralOptions || {}),
      },
    };
  }

  applyTo(layerId) {
    const layer = this.map.getLayer(layerId);
    const source = this.map.getSource(layer.source);

    this.map.once('idle', () => {
      const layout = {};
      const paint = {};

      Object.keys(layer.layout._values).forEach((key) => {
        layout[key] = layer.layout._values[key]?.value?.value || layer.layout._values[key];
      });
      Object.keys(layer.paint._values).forEach((key) => {
        paint[key] = layer.paint._values[key]?.value?.value || layer.paint._values[key];
      });

      this.map.on('click', (e) => {
        const { maxLeaves, closeOnLeafClick, minZoomLevel, zoomIncrement } = this.options;
        const features = this.map.queryRenderedFeatures(e.point);
        
        const leaf = features.find(f => f.layer.id.includes(`${layerId}-spiderfy-leaf`));
        if (leaf) {
          const feature = this.spiderifiedCluster?.leaves[leaf.layer.id.split('-spiderfy-leaf')[1]];
          if (this.options.onLeafClick) this.options.onLeafClick(feature);
          if (closeOnLeafClick) this._clearSpiderifiedCluster();
          return;
        }

        const cluster = features.find(f => f.layer.id === layerId && f.properties?.cluster);
        const prevClusterId = this.spiderifiedCluster?.cluster?.properties?.cluster_id;

        if (cluster && this.map.getZoom() < minZoomLevel) {
          if (zoomIncrement) {
            this.map.flyTo({center: e.lngLat.toArray(), zoom: this.map.getZoom() + zoomIncrement});
          }
          return;
        }

        if (this.spiderifiedCluster && prevClusterId === cluster?.properties?.cluster_id) return;

        this._clearSpiderifiedCluster();

        if (!cluster) return;

        this.clickedParentClusterStyle = { type: layer.type, layout, paint };

        const clusterId = cluster.properties.cluster_id;
        source.getClusterLeaves(clusterId, maxLeaves, 0, (error, leaves) => {
          this.spiderifiedCluster = { cluster, leaves };
          this._createSpiderfyLayers(layerId, leaves, cluster.geometry.coordinates);
          setTimeout(this._updateSpiderifiedClusterCoords(), 1000);
        });
      });

      this.map.on('zoom', async () => {
        if (!this.spiderifiedCluster) return;

        const currentCluster = this.spiderifiedCluster;
        const { maxLeaves } = this.options;

        const clustersOnMap = this.map.querySourceFeatures(layer.source, {
          sourceLayer: layerId,
        }).filter(feature => feature.properties.cluster);

        const sameClusterWithDifferentCoords = await findAsync(clustersOnMap, async (feature) => {
          const clusterId = feature.properties.cluster_id;
          const leaves = await getClusterLeavesAsync(source, clusterId, maxLeaves);
          return JSON.stringify(leaves) === JSON.stringify(currentCluster.leaves);
        });
        if (sameClusterWithDifferentCoords) {
          const { coordinates } = sameClusterWithDifferentCoords.geometry;
          this.spiderifiedCluster.cluster.geometry.coordinates = coordinates;
        } else {
          this._clearSpiderifiedCluster();
        }
      })

      this.map.on('zoomend', () => {
        this._updateSpiderifiedClusterCoords();
      })
    });
  }

  unspiderfyAll() {
    this._clearSpiderifiedCluster();
  }

  _calculatePointsInCircle(totalPoints) {
    const { leavesSeparation, leavesOffset } = this.options.circleOptions;
    const points = [];
    const theta = (Math.PI * 2) / totalPoints;
    let angle = theta;

    for (let i = 0; i < totalPoints; i += 1) {
      angle = theta * i;
      const x = leavesSeparation * Math.cos(angle) + leavesOffset[0];
      const y = leavesSeparation * Math.sin(angle) + leavesOffset[1];
      points.push([x, y]);
    }
    return points;
  }

  _calculatePointsInSpiral(totalPoints) {
    const { 
      legLengthStart, legLengthFactor, leavesSeparation, leavesOffset,
    } = this.options.spiralOptions;
    const points = [];
    let legLength = legLengthStart;
    let angle = 0;

    for (let i = 0; i < totalPoints; i += 1) {
      angle += (leavesSeparation / legLength + i * 0.0005);
      const x = legLength * Math.cos(angle) + leavesOffset[0];
      const y = legLength * Math.sin(angle) + leavesOffset[1];
      points.push([x, y]);

      legLength += ((Math.PI * 2) * legLengthFactor) / angle;
    }
    return points;
  }

  _clearSpiderifiedCluster() {
    const layerIds = [...this.activeSpiderfyLayerIds];
    layerIds.forEach((layerId) => {
      this.map.removeLayer(layerId);
      this.map.removeSource(layerId);
    });
    this.spiderifiedCluster = null;
    this.activeSpiderfyLayerIds = [];
  }
}

export default Spiderfy;
