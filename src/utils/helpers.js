import Color from 'color';

async function findAsync(arr, asyncCallback) {
  const promises = arr.map(asyncCallback);
  const results = await Promise.all(promises);
  const index = results.findIndex(result => result);
  return arr[index];
}

async function getClusterLeavesAsync(source, clusterId, maxLeaves) {
  return new Promise((resolve, reject) => {
    if (source.getClusterLeaves.toString().includes('sendAsync')) {
      source.getClusterLeaves(clusterId, maxLeaves, 0).then((features) => {
        resolve(features);
      });
    } else {
      source.getClusterLeaves(clusterId, maxLeaves, 0, (err, features) => {
        if (err) reject(err);
        else resolve(features);
      });
    }
  });
}

function calcAngleDegrees(x, y) {
  return (Math.atan2(y, x) * 180) / Math.PI;
}

function generateLegImage(pos1, pos2, width, colorString) {
  const color = Color(colorString);
  const a = pos1[0] - pos2[0];
  const b = pos1[1] - pos2[1];
  const height = Math.round(Math.sqrt((a * a) + (b * b)));
  const bytesPerPixel = 4;
  const data = new Uint8Array(height * width * bytesPerPixel);
  
  for (let w = 0; w < width; w += 1) {
    for (let h = 0; h < height; h += 1) {
      const offs = (h * width + w) * bytesPerPixel;
      data[offs + 0] = color.red();
      data[offs + 1] = color.green();
      data[offs + 2] = color.blue();
      data[offs + 3] = color.alpha() * 255;
    }
  }

  return { width, height, data };
}

export { 
  findAsync, getClusterLeavesAsync, generateLegImage, calcAngleDegrees,
};
