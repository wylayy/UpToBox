const geoip = require('geoip-lite');

// Track download analytics (without storing raw IP)
function trackDownload(fileId, req) {
  const rawIp = req.ip || req.connection.remoteAddress || '';
  const clientIp = rawIp.replace(/^::ffff:/, '');
  const geo = geoip.lookup(clientIp);
  const referrer = req.get('Referrer') || req.get('Referer') || 'direct';
  const userAgent = req.get('User-Agent') || 'unknown';

  return {
    fileId: fileId,
    timestamp: new Date().toISOString(),
    country: geo ? geo.country : 'Unknown',
    city: geo ? geo.city : 'Unknown',
    referrer: referrer,
    userAgent: userAgent
  };
}

module.exports = {
  trackDownload
};
