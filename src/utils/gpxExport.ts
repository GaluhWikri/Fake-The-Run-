interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: number; // Timestamp asli dari saat titik ditambahkan
}

interface RouteDetails {
  name: string;
  description: string;
}

export const exportToGPX = (points: RoutePoint[], activity: 'run' | 'bike', routeDetails?: RouteDetails, appPace?: number) => {
  if (points.length === 0) {
    alert('Tidak ada titik rute untuk diekspor. Silakan buat rute terlebih dahulu.');
    return;
  }

  const activityType = activity === 'run' ? 'running' : 'cycling';
  const now = new Date().toISOString();
  const routeName = routeDetails?.name || `${activityType} Route`;
  const routeDescription = routeDetails?.description || `Rute yang dihasilkan untuk ${activityType}`;

  const R = 6371; // Radius bumi dalam km untuk perhitungan jarak

  const haversineDistance = (p1: RoutePoint, p2: RoutePoint): number => {
    const dLat = (p2.lat - p1.lat) * Math.PI / 180;
    const dLng = (p2.lng - p1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Jarak dalam km
  };

  let totalDistance = 0;
  if (points.length > 1) {
    for (let i = 1; i < points.length; i++) {
      totalDistance += haversineDistance(points[i - 1], points[i]);
    }
  }

  const totalPoints = points.length;

  const calculatedSpeed = appPace && appPace > 0
    ? (3600 / appPace)
    : (activity === 'run' ? 10 : 20); // Kecepatan default dalam km/jam (lari 6:00/km)

  // Simulasi ketinggian yang lebih realistis dan acak
  let currentElevation = 100.0; // Ketinggian awal dalam meter
  const maxElevationChange = 2.0; // Perubahan ketinggian maksimal antar titik dalam meter

  const gpxPoints = points.map((point, index) => {
    let cumulativeDistanceToPoint = 0;
    if (index > 0) {
      for (let i = 1; i <= index; i++) {
        cumulativeDistanceToPoint += haversineDistance(points[i - 1], points[i]);
      }
    }

    const elapsedSeconds = (calculatedSpeed > 0) ? (cumulativeDistanceToPoint / calculatedSpeed) * 3600 : 0;
    const startTime = new Date(points[0].timestamp || Date.now());
    const pointTime = new Date(startTime.getTime() + elapsedSeconds * 1000);

    // Simulasi ketinggian dengan metode random walk
    if (index > 0) {
        const change = (Math.random() - 0.45) * maxElevationChange; // Cenderung sedikit menanjak
        currentElevation += change;
        if (currentElevation < 20) { // Pastikan tidak di bawah 20m
            currentElevation = 20 + Math.random() * 5;
        }
    }

    return {
      lat: point.lat.toFixed(6),
      lng: point.lng.toFixed(6),
      time: pointTime.toISOString(),
      elevation: currentElevation.toFixed(1)
    };
  });

  const totalDistanceFormatted = (totalDistance * 1000).toFixed(3); // Jarak dalam meter

  const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="RouteTracker v1.0" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${routeName}</name>
    <desc>${routeDescription}</desc>
    <author>
      <name>RouteTracker</name>
    </author>
    <time>${now}</time>
  </metadata>
  <trk>
    <name>${routeName}</name>
    <type>${activityType}</type>
    <trkseg>
      ${gpxPoints.map((point) => `
      <trkpt lat="${point.lat}" lon="${point.lng}">
        <ele>${point.elevation}</ele>
        <time>${point.time}</time>
      </trkpt>`).join('')}
    </trkseg>
  </trk>
</gpx>`;

  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  const fileName = routeDetails?.name
    ? `${routeDetails.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.gpx`
    : `${activityType}-route-${new Date().toISOString().split('T')[0]}.gpx`;

  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
