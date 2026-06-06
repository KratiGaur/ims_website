<?php
// Splash screen component - Include this at the beginning of header.php
?>
<div id="splashScreen" class="splash-screen">
  <div class="ribbon-container">
    <svg class="ribbon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Cancer Awareness Ribbon (Pink) -->
      <defs>
        <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#f472b6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Left loop of ribbon -->
      <path d="M 30 30 Q 20 30 20 45 Q 20 60 30 60 L 35 60 Q 40 60 40 50 Q 40 40 35 35 Q 30 30 30 30" 
            fill="url(#ribbonGradient)" filter="url(#glow)" stroke="#d1197e" stroke-width="0.5"/>
      
      <!-- Right loop of ribbon -->
      <path d="M 70 30 Q 80 30 80 45 Q 80 60 70 60 L 65 60 Q 60 60 60 50 Q 60 40 65 35 Q 70 30 70 30" 
            fill="url(#ribbonGradient)" filter="url(#glow)" stroke="#d1197e" stroke-width="0.5"/>
      
      <!-- Center knot -->
      <circle cx="50" cy="50" r="8" fill="url(#ribbonGradient)" filter="url(#glow)" stroke="#d1197e" stroke-width="0.5"/>
      
      <!-- Tail left -->
      <path d="M 35 60 Q 30 70 25 80" stroke="url(#ribbonGradient)" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#glow)"/>
      
      <!-- Tail right -->
      <path d="M 65 60 Q 70 70 75 80" stroke="url(#ribbonGradient)" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#glow)"/>
    </svg>
  </div>
  
  <div class="splash-text">
    <div class="loader-logo" aria-hidden="true">
      <div class="loader-logo-mark">
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" class="loader-logo-svg" role="img" aria-label="YROC logo">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#22d3ee" stop-opacity="1" />
              <stop offset="1" stop-color="#a78bfa" stop-opacity="1" />
            </linearGradient>
            <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="32" cy="32" r="26" fill="rgba(124,58,237,0.12)" stroke="rgba(34,211,238,0.35)" stroke-width="2" />
          <path d="M32 14c8.8 0 16 7.2 16 16s-7.2 16-16 16S16 38.8 16 30s7.2-16 16-16Z" fill="rgba(34,211,238,0.08)" />
          <path d="M18 40c6-9 22-9 28 0" fill="none" stroke="url(#g1)" stroke-width="4" stroke-linecap="round" filter="url(#logoGlow)" />
          <path d="M25 26c2.2-2.2 5.1-3.4 7-3.4 1.9 0 4.8 1.2 7 3.4" fill="none" stroke="url(#g1)" stroke-width="4" stroke-linecap="round" filter="url(#logoGlow)" />
          <path d="M32 22v20" stroke="rgba(255,255,255,0.55)" stroke-width="2" stroke-linecap="round" />
          <circle cx="32" cy="30" r="3" fill="url(#g1)" filter="url(#logoGlow)" />
        </svg>
      </div>
      <div class="loader-logo-ring" aria-hidden="true"></div>
    </div>

    <h1 class="splash-title">YROC 2027</h1>
    <p class="splash-subtitle">Young Radiation Oncology Conference</p>

    <div class="progress-wrap" aria-live="polite">
      <div class="progress-meta">
        <span id="loaderMessage" class="loader-message">Preparing a focused cancer care experience…</span>
        <span id="loaderPercent" class="loader-percent">0%</span>
      </div>
      <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
        <div id="loaderBar" class="progress-bar"></div>
      </div>
      <div class="progress-subtext">Please wait while the conference page initializes.</div>
    </div>
  </div>
</div>

