import { useState, useCallback } from 'react';
import StarCanvas      from './components/StarCanvas';
import EnvelopeStage   from './components/EnvelopeStage';
import InvitationCard  from './components/InvitationCard';
import './index.css';

// Scenes: 'waiting' → 'animating' → 'card'
export default function App() {
  const [scene, setScene] = useState('waiting');

  // Read personalized guest/family name from URL query (e.g. ?to=Nani+Group)
  const [guestName] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const name = params.get('to') || params.get('name') || '';
      return name.trim();
    } catch {
      return '';
    }
  });

  const handleSealClick = useCallback(() => setScene('animating'), []);
  const handleDone      = useCallback(() => setScene('card'),      []);
  const handleReplay    = useCallback(() => setScene('waiting'),   []);

  return (
    <>
      <StarCanvas />

      <EnvelopeStage
        scene={scene}
        guestName={guestName}
        onSealClick={handleSealClick}
        onDone={handleDone}
      />

      <InvitationCard
        active={scene === 'card'}
        guestName={guestName}
        onReplay={handleReplay}
      />
    </>
  );
}
