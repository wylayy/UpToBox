const geoip = require('geoip-lite');

// Track download analytics
function trackDownload(fileId, req) {
  const ip = req.ip || req.connection.remoteAddress;
  const geo = geoip.lookup(ip);
  const referrer = req.get('Referrer') || req.get('Referer') || 'direct';
  const userAgent = req.get('User-Agent') || 'unknown';

  return {
    fileId: fileId,
    timestamp: new Date().toISOString(),
    ip: ip,
    country: geo ? geo.country : 'Unknown',
    city: geo ? geo.city : 'Unknown',
    referrer: referrer,
    userAgent: userAgent
  };
}

module.exports = {
  trackDownload
};
