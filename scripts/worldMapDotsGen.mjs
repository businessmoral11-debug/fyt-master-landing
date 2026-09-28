
export function pointInRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect = yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function pointInMultiPolygon(lon, lat, multiPolygonCoordinates) {
  for (const polygon of multiPolygonCoordinates) {
    let inPolygon = pointInRing(lon, lat, polygon[0]);
    if (inPolygon) {
      for (let h = 1; h < polygon.length; h++) {
        if (pointInRing(lon, lat, polygon[h])) {
          inPolygon = false;
          break;
        }
      }
    }
    if (inPolygon) return true;
  }
  return false;
}

export function sampleLandGrid(multiPolygonCoordinates, stepDeg) {
  const points = [];
  for (let lat = -90; lat <= 90; lat += stepDeg) {
    for (let lon = -180; lon < 180; lon += stepDeg) {
      if (pointInMultiPolygon(lon, lat, multiPolygonCoordinates)) {
        points.push([lon, lat]);
      }
    }
  }
  return points;
}
