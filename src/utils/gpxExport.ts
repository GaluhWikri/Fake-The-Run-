interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: number;
}

interface RouteDetails {
  name: string;
  description: string;
}

export const exportToGPX = (points: RoutePoint[], activity: 'run' | 'bike', routeDetails?: RouteDetails) => {
  if (points.length === 0) {
    alert('No route points to export. Please create a route first.');
    return;
  }

  const activityType = activity === 'run' ? 'running' : 'cycling';
  const now = new Date().toISOString();
  const routeName = routeDetails?.name || `${activityType} Route`;
  const routeDescription = routeDetails?.description || `Generated route for ${activityType}`;
  
  // Calculate total distance
  const calculateDistance = () => {
    if (points.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      const R = 6371; // Earth's radius in km
      const dLat = (points[i].lat - points[i-1].lat) * Math.PI / 180;
      const dLng = (points[i].lng - points[i-1].lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(points[i-1].lat * Math.PI / 180) * Math.cos(points[i].lat * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      totalDistance += R * c;
    }
    return totalDistance;
  };

  const totalDistance = calculateDistance();
  const totalPoints = points.length;
  
  // Convert points to GPX format with proper timestamps
  const convertToGPX = (point: RoutePoint, index: number) => {
    // Create realistic timestamps with intervals
    const baseTime = new Date(point.timestamp);
    const timeOffset = index * 10000; // 10 seconds between points
    const pointTime = new Date(baseTime.getTime() + timeOffset);
    
    return {
      lat: point.lat.toFixed(6),
      lng: point.lng.toFixed(6),
      time: pointTime.toISOString(),
      elevation: (Math.random() * 50 + 100).toFixed(1) // Mock elevation data
    };
  };

  const gpxPoints = points.map(convertToGPX);
  
  // Enhanced GPX content with more metadata
  const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="RouteTracker v1.0" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${routeName}</name>
    <desc>${routeDescription}</desc>
    <author>
      <name>RouteTracker</name>
    </author>
    <time>${now}</time>
    <keywords>${activityType}, route, gps, track</keywords>
    <bounds minlat="${Math.min(...gpxPoints.map(p => parseFloat(p.lat)))}" 
            minlon="${Math.min(...gpxPoints.map(p => parseFloat(p.lng)))}" 
            maxlat="${Math.max(...gpxPoints.map(p => parseFloat(p.lat)))}" 
            maxlon="${Math.max(...gpxPoints.map(p => parseFloat(p.lng)))}"/>
  </metadata>
  
  <!-- Route waypoints -->
  ${gpxPoints.length > 0 ? `<rte>
    <name>${routeName} - Waypoints</name>
    <desc>Route waypoints for ${routeName}</desc>
    ${gpxPoints.filter((_, index) => index === 0 || index === gpxPoints.length - 1 || index % 10 === 0).map((point, index) => `
    <rtept lat="${point.lat}" lon="${point.lng}">
      <ele>${point.elevation}</ele>
      <time>${point.time}</time>
      <name>WP${index + 1}</name>
      <desc>Waypoint ${index + 1}</desc>
    </rtept>`).join('')}
  </rte>` : ''}
  
  <!-- Track data -->
  <trk>
    <name>${routeName}</name>
    <desc>${routeDescription}</desc>
    <type>${activityType}</type>
    <extensions>
      <distance>${totalDistance.toFixed(3)}</distance>
      <points>${totalPoints}</points>
      <activity>${activity}</activity>
    </extensions>
    <trkseg>
      ${gpxPoints.map((point, index) => `
      <trkpt lat="${point.lat}" lon="${point.lng}">
        <ele>${point.elevation}</ele>
        <time>${point.time}</time>
        <extensions>
          <speed>${(Math.random() * 5 + 8).toFixed(2)}</speed>
          <course>${(Math.random() * 360).toFixed(0)}</course>
        </extensions>
      </trkpt>`).join('')}
    </trkseg>
  </trk>
</gpx>`;

  // Create and download the file
  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  
  // Generate filename
  const fileName = routeDetails?.name 
    ? `${routeDetails.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.gpx`
    : `${activityType}-route-${new Date().toISOString().split('T')[0]}.gpx`;
  
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};