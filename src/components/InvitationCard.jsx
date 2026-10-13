import { useState, useEffect } from 'react';
import ScratchCard from './ScratchCard';
import VenueSection from './VenueSection';
import { startRoyalAmbientMusic, stopRoyalAmbientMusic } from '../utils/audio';
import './InvitationCard.css';

const GoldDivider = ({ symbol = '❦' }) => (
  <div className="gold-divider">
    <div className="gold-div-line" />
    <span className="gold-div-symbol">{symbol}</span>
    <div className="gold-div-line" />
  </div>
);

const CornerOrnament = ({ position }) => (
  <div className={`corner-ornament corner-${position}`}>
    <svg viewBox="0 0 100 100" fill="currentColor">
      <path d="M0,0 L100,0 C70,10 50,30 40,60 C30,90 10,95 0,100 Z" opacity="0.15" />
      <path d="M5,5 Q40,10 35,45 Q30,70 5,80" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="35" cy="45" r="3" />
      <path d="M15,5 Q50,15 45,50" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
    </svg>
  </div>
);

export default function InvitationCard({ active, guestName, onReplay }) {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [blessingCount, setBlessingCount] = useState(128);
  const [hasBlessed, setHasBlessed] = useState(false);
  const [showHearts, setShowHearts] = useState([]);

  // Clean up and stop music if card becomes inactive (e.g. replay) or on unmount
  useEffect(() => {
    return () => {
      stopRoyalAmbientMusic([], setIsPlayingMusic);
    };
  }, []);

  useEffect(() => {
    if (!active) {
      stopRoyalAmbientMusic([], setIsPlayingMusic);
    }
  }, [active]);

  // Toggle ambient music
  const toggleMusic = () => {
    if (isPlayingMusic) {
      stopRoyalAmbientMusic([], setIsPlayingMusic);
    } else {
      startRoyalAmbientMusic(setIsPlayingMusic);
    }
  };

  // Heart blessing tap
  const handleBlessing = () => {
    if (!hasBlessed) {
      setBlessingCount(prev => prev + 1);
      setHasBlessed(true);
    }
    const newHearts = Array.from({ length: 6 }, () => ({
      id: Math.random(),
      x: Math.random() * 80 + 10,
      scale: Math.random() * 0.6 + 0.8,
    }));
    setShowHearts(newHearts);
    setTimeout(() => setShowHearts([]), 1800);
  };

  const whatsappMessage = encodeURIComponent(
    'Salam / Greetings! I am overjoyed to receive your Ring Ceremony invitation for Ayesha & Zaid. I gladly confirm my attendance! 💍✨'
  );

  return (
    <div className={`invitation-screen ${active ? 'active' : ''}`}>
      {/* Floating Music Toggle Button */}
      <button
        type="button"
        className={`floating-music-btn ${isPlayingMusic ? 'playing' : ''}`}
        onClick={toggleMusic}
        title={isPlayingMusic ? 'Mute Royal Music' : 'Play Royal Music'}
        aria-label="Toggle background music"
      >
        <span className="music-icon">{isPlayingMusic ? '🔊' : '🎵'}</span>
        <span className="music-pulse" />
      </button>

      <div className="card-container">
        <div className="royal-card arch-card">
          {/* Cathedral Arch Frame Borders */}
          <div className="card-arch-frame" />
          <div className="card-arch-frame-inner" />

          {/* Top Header — Bismillah + Meaning + Invitation Title */}
          {/* Top Header — Bismillah + Meaning + Invitation Title */}
          <div className="card-header-section">
            <p className="bismillah-urdu" dir="rtl" lang="ur">
              بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ
            </p>
            <p className="bismillah-meaning">
              In the Name of Allah, the Most Beneficent, the Most Merciful
            </p>
            <h2 className="invitation-main-title">Invitation</h2>
            <p className="invitation-from-badge">
              <span>✦</span> From Badruddin &amp; Family <span>✦</span>
            </p>
          </div>

          <GoldDivider symbol="✦" />

          {/* Royal 3D Wax Seal Monogram with Capital A & Z & Rings on Left */}
          <div className="royal-seal-showcase">
            <img
              src="/gold-rings.png"
              alt="Golden Wedding Rings"
              className="royal-seal-left-rings"
              draggable="false"
            />
            <div className="seal-halo-ring" />
            <img
              src="/royal-seal-az.png"
              alt="Royal Monogram A &amp; Z Wax Seal"
              className="royal-seal-img"
              draggable="false"
            />
          </div>

          <div className="card-body">
            <p className="invitation-intro">
              We cordially invite you to celebrate the
            </p>
            <h1 className="ceremony-headline">Ring Ceremony</h1>

            <GoldDivider symbol="💍" />

            {/* Couple Names */}
            <div className="couple-names-wrap">
              <h2 className="bride-name">
                <span className="name-capital">A</span>yesha
              </h2>
              <div className="ampersand-wrap">
                <span className="ampersand-sign">&amp;</span>
              </div>
              <h2 className="groom-name">
                <span className="name-capital">Z</span>aid
              </h2>
            </div>

            <p className="card-poetic-quote">
              "And of His signs is that He created for you companions from among yourselves,
              that you may find tranquility in them; and He placed between you affection and mercy."
            </p>

            <GoldDivider symbol="❦" />

            {/* Personalized Guest Invitation Greeting */}
            <div className="personalized-guest-box">
              {guestName && (
                <div className="guest-capsule-badge">
                  <span className="capsule-star">✦</span>
                  <span className="guest-name-highlight">{guestName}</span>
                  <span className="capsule-star">✦</span>
                </div>
              )}
              <p className="guest-invited-text">
                We invite you to celebrate the Ring Ceremony
              </p>
            </div>

            {/* ✦ INTERACTIVE SCRATCH CARD FOR THE DATE ✦ */}
            <ScratchCard
              date="Tuesday, 27 October 2026"
              time="7:00 PM Onwards"
              targetDate="2026-10-27T19:00:00"
            />

            <GoldDivider symbol="✦" />

            {/* ✦ PROGRAM ITINERARY ✦ */}
            <div className="itinerary-section">
              <span className="royal-badge">✦ AUSPICIOUS CELEBRATIONS ✦</span>
              <h3 className="section-title">Ceremony Itinerary</h3>
              <div className="timeline-flow">
                <div className="timeline-step highlight">
                  <div className="timeline-step-time-col">
                    <span className="step-time">7:00 PM</span>
                  </div>
                  <div className="timeline-step-node">
                    <span>💍</span>
                  </div>
                  <div className="timeline-step-card">
                    <h4>Ring Ceremony</h4>
                    <p>The auspicious exchange of rings and sacred vows</p>
                  </div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-step-time-col">
                    <span className="step-time">8:30 PM</span>
                  </div>
                  <div className="timeline-step-node">
                    <span>🍽️</span>
                  </div>
                  <div className="timeline-step-card">
                    <h4>Feast (Dawat-e-Khaas)</h4>
                    <p>Grand banquet dinner with exquisite gourmet delicacies</p>
                  </div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-step-time-col">
                    <span className="step-time">9:45 PM</span>
                  </div>
                  <div className="timeline-step-node">
                    <span>✨</span>
                  </div>
                  <div className="timeline-step-card">
                    <h4>Duas &amp; Photo Memories</h4>
                    <p>Capturing joyful moments and warm blessings</p>
                  </div>
                </div>
              </div>
            </div>

            <GoldDivider symbol="❦" />

            {/* ✦ VENUE & INTERACTIVE MAP ✦ */}
            <VenueSection
              venueName="Narottam Zaveri Hall"
              address="Paldi Police Chowki, Museum Road, Bhagtacharya Rd, Kocharab, Paldi, Ahmedabad, Gujarat 380006"
              landmark="Near Paldi Police Chowki, Museum Road"
              mapQuery="Narottam Zaveri Hall, Paldi, Ahmedabad, Gujarat"
            />

            <GoldDivider symbol="✦" />

            {/* ✦ FAMILY INVITATION & HOSTS ✦ */}
            <div className="hosts-section">
              <p className="hosted-by-tag">WARMLY WELCOMED WITH LOVE BY</p>
              <div className="hosts-grid">
                <div className="host-card">
                  <span className="host-badge">BRIDE'S FAMILY</span>
                  <h4 className="host-name">Family of Ayesha</h4>
                  <p className="host-detail">Awaiting your gracious presence &amp; duas</p>
                </div>

                <div className="host-card">
                  <span className="host-badge">GROOM'S FAMILY</span>
                  <h4 className="host-name">Family of Zaid</h4>
                  <p className="host-detail">Awaiting your gracious presence &amp; duas</p>
                </div>
              </div>

              {/* Bottom Center Shaikh Family Note */}
              <div className="family-with-love">
                <span className="family-flourish">❦</span>
                <p className="family-love-text">With Love</p>
                <h3 className="family-love-name">Shaikh Family</h3>
                <span className="family-flourish">❦</span>
              </div>
            </div>



            {/* Replay Cinematic Envelope Button */}
            <div className="replay-wrapper">
              <button type="button" className="royal-replay-btn" onClick={onReplay}>
                ↩ Watch Envelope Opening Again
              </button>
            </div>

            {/* ✦ Footer Watermark & Copyright ✦ */}
            <footer className="card-footer-watermark">
              <img
                src="/ls-logo.png"
                alt="Lukman Shaikh Logo"
                className="footer-watermark-logo"
                loading="lazy"
              />
              <p className="footer-copyright">
                &copy; 2026 LS. All Rights Reserved.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
