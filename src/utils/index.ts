// function getMinLocation(center, radius) {
//   const earthRadius = 6371; // Earth's radius in kilometers
//   const latDiff = (radius / earthRadius) * (180 / Math.PI);
//   const minLat = center.latitude - latDiff;
//   const minLon = center.longitude - latDiff / Math.cos(center.latitude * Math.PI / 180);
//   return new firebase.firestore.GeoPoint(minLat, minLon);
// }

// function getMaxLocation(center, radius) {
//   const earthRadius = 6371; // Earth's radius in kilometers
//   const latDiff = (radius / earthRadius) * (180 / Math.PI);
//   const maxLat = center.latitude + latDiff;
//   const maxLon = center.longitude + latDiff / Math.cos(center.latitude * Math.PI / 180);
//   return new firebase.firestore.GeoPoint(maxLat, maxLon);
// }