import React from 'react';

export default function CinematicBackdrop() {
  return (
    <div className="cinematic-backdrop" aria-hidden="true">
      <span className="cinematic-light cinematic-light-purple" />
      <span className="cinematic-light cinematic-light-pink" />
      <span className="cinematic-light cinematic-light-cyan" />
      <span className="cinematic-particle-field cinematic-particle-field-a" />
      <span className="cinematic-particle-field cinematic-particle-field-b" />
    </div>
  );
}
