import SpiderfyFlat from './SpiderfyFlat';
import Spiderfy3D from './Spiderfy3D';

export default function getSpiderfyObject(map, options) {
  switch (options?.method && options.method.toUpperCase()) {
    case '3D':
      return new Spiderfy3D(map, options);
    default:
      return new SpiderfyFlat(map, options);
  }
}
