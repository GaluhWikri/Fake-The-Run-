interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: number; // Original timestamp from when the point was added
}

interface RouteDetails {
  name: string;
  description: string;
}

// Tambahkan appPace sebagai parameter opsional
export const exportToGPX = (points: RoutePoint[], activity: 'run' | 'bike', routeDetails?: RouteDetails, appPace?: number) => {
  if (points.length === 0) {
    alert('No route points to export. Please create a route first.');
    return;
  }

  const activityType = activity === 'run' ? 'running' : 'cycling';
  const now = new Date().toISOString();
  const routeName = routeDetails?.name || `${activityType} Route`;
  const routeDescription = routeDetails?.description || `Generated route for ${activityType}`;

  const R = 6371; // Earth's radius in km for distance calculations

  // Function to calculate distance between two lat/lng points (Haversine formula)
  const haversineDistance = (p1: RoutePoint, p2: RoutePoint): number => {
    const dLat = (p2.lat - p1.lat) * Math.PI / 180;
    const dLng = (p2.lng - p1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  let totalDistance = 0;
  if (points.length > 1) {
    for (let i = 1; i < points.length; i++) {
      totalDistance += haversineDistance(points[i - 1], points[i]);
    }
  }

  const totalPoints = points.length;

  // Calculate speed (km/h) based on provided pace (seconds/km)
  // If appPace is 0 or undefined, default to a reasonable speed (e.g., 10 km/h for cycling, 5 km/h for running)
  const calculatedSpeed = appPace && appPace > 0
    ? (3600 / appPace) // Convert seconds/km to km/h
    : (activity === 'run' ? 5 : 20); // Default speed in km/h

  // Parameter untuk simulasi elevasi
  const baseElevation = 100; // Elevasi dasar dalam meter
  const elevationAmplitude = 50; // Amplitudo gelombang elevasi dalam meter

  const gpxPoints = points.map((point, index) => {
    // Calculate cumulative distance to this point
    let cumulativeDistanceToPoint = 0;
    if (index > 0) {
      for (let i = 1; i <= index; i++) {
        cumulativeDistanceToPoint += haversineDistance(points[i - 1], points[i]);
      }
    }

    // Calculate elapsed time based on cumulative distance and calculated speed
    // time_in_seconds = distance_in_km / (speed_in_km/h / 3600_seconds_per_hour)
    const elapsedSeconds = (calculatedSpeed > 0) ? (cumulativeDistanceToPoint / calculatedSpeed) * 3600 : 0;

    // Use the route's starting timestamp for the first point, then add elapsedSeconds
    const startTime = new Date(points[0].timestamp || Date.now()); // Fallback to current time if first point has no timestamp
    const pointTime = new Date(startTime.getTime() + elapsedSeconds * 1000);

    // Simulated undulating elevation
    // Menggunakan fungsi sinus untuk membuat profil elevasi yang naik turun secara lembut
    const simulatedElevation = baseElevation + elevationAmplitude * Math.sin(index * Math.PI / (points.length / 5)); // Menyesuaikan siklus gelombang

    return {
      lat: point.lat.toFixed(6),
      lng: point.lng.toFixed(6),
      time: pointTime.toISOString(),
      elevation: simulatedElevation.toFixed(1) // Menggunakan elevasi simulasi
    };
  });

  // Ensure totalDistance in GPX metadata matches the actual calculated totalDistance
  const totalDistanceFormatted = totalDistance.toFixed(3);

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

  <trk>
    <name>${routeName}</name>
    <desc>${routeDescription}</desc>
    <type>${activityType}</type>
    <extensions>
      <distance>${totalDistanceFormatted}</distance>
      <points>${totalPoints}</points>
      <activity>${activity}</activity>
      <pace>${appPace ? appPace.toFixed(2) : 'N/A'}</pace>
      <speed>${calculatedSpeed.toFixed(2)}</speed>
    </extensions>
    <trkseg>
      ${gpxPoints.map((point) => `
      <trkpt lat="${point.lat}" lon="${point.lng}">
        <ele>${point.elevation}</ele>
        <time>${point.time}</time>
        <extensions>
          <speed>${calculatedSpeed.toFixed(2)}</speed>
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