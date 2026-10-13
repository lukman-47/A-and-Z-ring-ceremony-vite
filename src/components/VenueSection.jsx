import { useState } from 'react';
import './VenueSection.css';

export default function VenueSection({
  venueName = 'The Royal Heritage Palace & Grand Ballroom',
  address = 'Palace Road, Jubilee Hills, Hyderabad, Telangana 500033',
  landmark = 'Near Royal Heritage Lake & Golf Greens',
  mapQuery = 'The Royal Heritage Palace, Jubilee Hills, Hyderabad',
}) {
  const [copied, setCopied] = useState(false);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery
  )}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${venueName}, ${address}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="venue-section">
      <div className="venue-header">
        <span className="royal-badge">✦ VENUE &amp; LOCATION ✦</span>
        <h3 className="venue-title">The Venue</h3>
        <p className="venue-subtitle">Where memories of a lifetime begin</p>
      </div>

      <div className="venue-card">
        {/* Location Pin Icon & Name */}
        <div className="venue-icon-wrap">
          <span className="venue-icon">📍</span>
        </div>

        <h4 className="venue-name">{venueName}</h4>
        <p className="venue-address">
          <span>📍</span> {address}
        </p>
        <p className="venue-landmark">
          <em>Landmark: {landmark}</em>
        </p>




        {/* Interactive Map Embed */}
        <div className="map-frame-wrapper">
          <iframe
            title="Venue Location Map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              mapQuery
            )}&z=15&output=embed`}
            className="venue-map-iframe"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="map-gold-frame" />
        </div>

        {/* Action Buttons */}
        <div className="venue-actions">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="venue-btn primary-btn"
          >
            🧭 Open in Google Maps
          </a>

          <button
            type="button"
            className={`venue-btn secondary-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyAddress}
          >
            {copied ? '✓ Address Copied!' : '📋 Copy Address'}
          </button>
        </div>
      </div>
    </div>
  );
}
