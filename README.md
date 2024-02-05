# map-gl-js-spiderfy &middot; [![npm version](https://img.shields.io/npm/v/@nazka/map-gl-js-spiderfy)](https://www.npmjs.com/package/@nazka/map-gl-js-spiderfy) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/nazka/map-gl-js-spiderfy#contributing)

### $${\color{red}The \space latest \space Maplibre \space release \space (4.0.0) \space breaks \space this \space plugin. \space Please \space use \space Maplibre \space 3.6.2 \space while \space I \space resolve \space this \space issue.}$$

Spiderfy plugin for [maplibre-gl](https://maplibre.org/) and [mapbox-gl](https://www.mapbox.com/mapbox-gljs). This plugin creates the spiderfication in the canvas
itself instead of on top of it. This allows for more advanced interactions with the map and its content. This plugin builds further upon the [cluster](https://maplibre.org/maplibre-gl-js-docs/style-spec/sources/#geojson-cluster) functionality of maplibre and mapbox.

This opensource project is maintained by [nazka mapps](https://www.nazka.be/en/), we gladly welcome any [contributions](https://github.com/nazka/map-gl-js-spiderfy#contributing)!

We try to stand out by:
- compatibility with both mapbox-gl and maplibre-gl
- rendering in the canvas (with 3D rendering support)
- a lot of customizable properties and options (see advanced demo)

A nice extra, since the spiderfication is part of the canvas, generating screenshots of it is really easy

![screenshot (15)](https://user-images.githubusercontent.com/9056487/153424126-016bacd1-5e8c-4cbc-9607-8a8a9943e7a3.PNG)

## Demo examples
- [map-gl-js-spiderfy basic demo](https://codepen.io/nazka-mapps/full/YzroBBm) - highlights what you can already achieve with little code
- [map-gl-js-spiderfy advanced demo](https://codepen.io/nazka-mapps/full/KKXjJYX) - includes all spiderfy options to play around with

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
  minZoomLevel: 12,
  zoomIncrement: 2,
});

// enable spiderfy on a layer
// IMPORTANT: the layer must have a cluster source
spiderfy.applyTo('markers');
```
*Please refer to the demo examples first if you're having issues.*

## Docs
#### New Spiderfy instance
```js
new Spiderfy(map, options)
```

#### Options
- **`map`** - reference to a maplibre-gl or mapbox-gl instance [object]

- **`options`**
  - **`onLeafClick`** - allows to put an action on the clicked leaf [function (feature, event)]

  - **`onLeafHover`** - allows to put an action on the hovered leaf [function (feature, event)]

  - **`minZoomLevel`** - allows spiderfication starting from this zoom level [number] [default: 0]

  - **`zoomIncrement`** - if minZoomLevel is not reached on cluster click, the map will zoom by this amount instead [number] [default: 2]
  
  - **`closeOnLeafClick`** - remove the spiderfication on leaf click [boolean] [default: true]
  
  - **`circleSpiralSwitchover`** - number of leaves required to switch from circle to spiral spiderfication [number] [default: 10]
  
  - **`circleOptions`** - options that are specific to circle spiderfications [object]
  
    - **`leavesSeparation`** - distance between the spiderfied leaves in pixels [number] [default: 50]
    
    - **`leavesOffset`** - moves the leaves relative to the parent cluster in pixels [array] [default: [0, 0]]
  
  - **`spiralOptions`** - options that are specific to spiral spiderfications, these interact with each other and will probably all require some tweaking when changing one of them [object]
  
    - **`legLengthStart`** - the starting length of the spider leg in pixels [number] [default: 25]
    
    - **`legLengthFactor`** - the growth factor of the next leg in pixels [number] [default: 2.2]
    
    - **`leavesSeparation`** - distance between the spiderfied leaves in pixels [number] [default: 30]
    
    - **`leavesOffset`** - moves the leaves relative to the parent cluster in pixels [array] [default: [0, 0]]
  
  - **`spiderLegsAreHidden`** - don't render the spider legs [boolean] [default: false]
  
  - **`spiderLegsWidth`** - the width of the spider legs in pixel [number] [default: 1]
  
  - **`spiderLegsColor`** - the color of the spider legs [string] [default: 1]
  
  - **`spiderLeavesLayout`** - your own style layout attributes ('icon-offset' can't be used) [object] [default: cluster layout]
  
  - **`spiderLeavesPaint`** - your own style paint attributes [object] [default: cluster paint]
  
  - **`maxLeaves`** - limits the amount of leaves that can be in a spiderfication [number] [default: 255]
  
  - **`renderMethod`** - set to "3D" for this experimental render feature [string] [default: 'flat']

#### Functions
- `applyTo(layerId)` apply the spiderfier on a layer [function]

  - `layerId` maplibre/mapbox layer id [string]

- `unspiderfyAll()` clears any active spiderfication from the map [function]

## Contributing
If an [issue](https://github.com/nazka/map-gl-js-spiderfy/issues) has a `help wanted` tag this means you can pick it up, just let us know.

You will have to create a fork of this project with your own branch and work on there. Once that's done you can create a pull request on this repo. One of the maintainers will have a look at it and give the necessary feedback/questions or merge it into this project. 

Take a look at [this repo](https://github.com/firstcontributions/first-contributions) if you haven't made a contribution to a project on github yet.

## License
This package is published under the [BSD-3-Clause License](https://github.com/nazka/map-gl-js-spiderfy/blob/dev/LICENSE).
Copyright (c) 2022, [nazka mapps](https://www.nazka.be/en/)
