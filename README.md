# map-gl-js-spiderfy
Spiderfy plugin for [maplibre-gl](https://maplibre.org/) and [mapbox-gl](https://www.mapbox.com/mapbox-gljs). This plugin creates the spiderfication in the canvas
itself instead of on top of it. This allows for more advanced interactions with the map and its content.

This opensource project is maintained by [nazka mapps](https://www.nazka.be/en/), we gladly welcome any contributions!

## Examples
- [map-gl-js-spiderfy basic demo](https://codepen.io/cssimon/full/vYePWLW)
- [map-gl-js-spiderfy advanced demo](https://codepen.io/cssimon/full/NWamBRL)

## Usage
Install the npm package:
```
npm install @nazka/map-gl-js-spiderfy
```
Simple setup:
```js
import Spiderfy from '@nazka/map-gl-js-spiderfy';

...

// create a new spiderfy object
const spiderfy = new Spiderfy(map, {
  onLeafClick: f => console.log(f),
  closeOnLeafSelect: false,
});

// enable spiderfy on a layer
// IMPORTANT: the layer must have a cluster source
spiderfy.applyTo('markers');
```
*Please refer the examples first if you're having issues.*

## Docs
#### New Spiderfy instance
```js
new Spiderfy(map, options)
```

#### Options
- **`map`** - reference to a maplibre-gl or mapbox-gl instance [object]

- **`options`**
  - **`onLeafClick`** - allows to do something with the clicked leaf [function]
  
  - **`maxLeaves`** - limit the amount of leaves that can be in a spiderfication [number]
  
  - **`closeOnLeafClick`** - clear the spiderfication on leaf click [boolean]
  
  - **`circleSpiralSwitchover`** - number of leaves required to switch from circle to spiral spiderfication [number]
  
  - **`circleOptions`** - options that are specific to circle spiderfications [object]
    - **`leavesSeparation`** - distance between the spiderfied leaves in pixels [number]
    - **`leavesOffset`** - move the leaves relative to the parent cluster in pixels [number]
  
  - **`spiralOptions`** - options that are specific to spiral spiderfications [object]
    - **`legLengthStart`** - the starting length of the spider leg [number]
    - **`legLengthFactor`** - the growth factor of the next leg [number]
    - **`leavesSeparation`** - distance between the spiderfied leaves [number]
    - **`leavesOffset`** - move the leaves relative to the parent cluster in pixels [number]
  
  - **`spiderLegsAreHidden`** - don't render the spider legs [boolean]
  
  - **`spiderLegsWidth`** - the with of the spider legs in pixel [number]
  
  - **`spiderLegsColor`** - the color of the spider legs [string]
  
  - **`spiderLeavesLayout`** - your own style layout attributes ('icon-offset' can't be used) [object]
  
  - **`spiderLeavesPaint`** - your own style paint attributes [object]
  
  - **`method`** - set to "3D" for this experimental render feature [string]

**NOTE**: spiralOptions interact with each other and they will probably all require some tweaking when changing one

#### Methods
- `applyTo(layerId)` apply the spiderfier on a layer [function]
  - `layerId` maplibre/mapbox layer id [string]
