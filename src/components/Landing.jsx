import './Landing.css';

export default function Landing({ hidden, onOpen }) {
  return (
    <div className={`landing${hidden ? ' hidden' : ''}`}>
      <p className="landing-title">A &amp; Z</p>
      <p className="landing-sub">Ring Ceremony Invitation</p>

      <div className="seal-wrap" onClick={onOpen}>
        <div className="seal-glow" />
        <div className="seal-ring" />
        <div className="seal-ring slow" />

        <button className="seal-btn" aria-label="Open Invitation">
          <span className="seal-initials">A&amp;Z</span>
          <span className="seal-hint">Tap to open</span>
        </button>
      </div>

      <p className="click-label">✦ Click the seal to open ✦</p>
    </div>
  );
}
