import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public', 'stickers');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Helper to wrap in standard SVG sticker container with die-cut white border and shadow
function createStickerSvg(content, bgCircle = '#FFEBF3', accent = '#FF6EB4') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <filter id="sticker-shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="3" dy="4" stdDeviation="0" flood-color="#111111" flood-opacity="1"/>
    </filter>
    <linearGradient id="holo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00D4D8"/>
      <stop offset="50%" stop-color="#FF6EB4"/>
      <stop offset="100%" stop-color="#F5E642"/>
    </linearGradient>
  </defs>
  
  <!-- Outer Die-Cut White Rim with Neo-Brutalist Border -->
  <g filter="url(#sticker-shadow)">
    <circle cx="100" cy="100" r="90" fill="#FFFFFF" stroke="#111111" stroke-width="4.5"/>
    <circle cx="100" cy="100" r="82" fill="${bgCircle}"/>
    
    <!-- Sticker Art -->
    ${content}
    
    <!-- Glossy Highlight Arch -->
    <path d="M 45 45 A 75 75 0 0 1 155 45 A 72 72 0 0 0 45 45 Z" fill="#FFFFFF" opacity="0.6"/>
  </g>
</svg>`;
}

const stickers = {
  'boba-ghost.svg': createStickerSvg(`
    <!-- Ghost Body -->
    <path d="M 60 120 C 55 70, 75 45, 100 45 C 125 45, 145 70, 140 120 C 135 130, 125 125, 120 130 C 115 135, 105 130, 100 135 C 95 130, 85 135, 80 130 C 75 125, 65 130, 60 120 Z" 
          fill="#FFFFFF" stroke="#111111" stroke-width="4" stroke-linejoin="round"/>
    <!-- Cheeks & Eyes -->
    <ellipse cx="80" cy="85" rx="4" ry="6" fill="#111111"/>
    <ellipse cx="120" cy="85" rx="4" ry="6" fill="#111111"/>
    <ellipse cx="72" cy="94" rx="7" ry="4" fill="#FF6EB4"/>
    <ellipse cx="128" cy="94" rx="7" ry="4" fill="#FF6EB4"/>
    <!-- Boba Cup in Hands -->
    <rect x="85" y="95" width="30" height="36" rx="5" fill="#E6D5F7" stroke="#111111" stroke-width="3.5"/>
    <line x1="100" y1="82" x2="100" y2="105" stroke="#FF6EB4" stroke-width="4" stroke-linecap="round"/>
    <!-- Tapioca Pearls -->
    <circle cx="93" cy="122" r="3" fill="#111111"/>
    <circle cx="101" cy="124" r="3" fill="#111111"/>
    <circle cx="107" cy="121" r="3" fill="#111111"/>
    <!-- Floating Sparkles -->
    <polygon points="145,55 148,62 155,65 148,68 145,75 142,68 135,65 142,62" fill="#F5E642" stroke="#111111" stroke-width="2"/>
  `, '#EBF4FF'),

  'caffeinated-python.svg': createStickerSvg(`
    <!-- Coiled Python Body -->
    <path d="M 55 125 C 40 100, 60 70, 95 65 C 135 60, 155 85, 145 115 C 140 135, 110 145, 80 140 C 65 138, 55 125, 55 125 Z" 
          fill="#3776AB" stroke="#111111" stroke-width="4"/>
    <!-- Yellow Belly / Accent -->
    <path d="M 75 75 C 95 68, 125 70, 135 90 C 130 115, 115 125, 90 120" 
          fill="none" stroke="#FFD43B" stroke-width="8" stroke-linecap="round"/>
    <!-- Cute Snake Head with Coffee Steam -->
    <circle cx="75" cy="80" r="18" fill="#3776AB" stroke="#111111" stroke-width="3.5"/>
    <circle cx="70" cy="77" r="4" fill="#FFFFFF"/>
    <circle cx="71" cy="77" r="2.5" fill="#111111"/>
    <path d="M 60 85 Q 52 87 56 93" stroke="#FF6EB4" stroke-width="2.5" fill="none"/>
    <!-- Giant Mug -->
    <rect x="100" y="95" width="34" height="30" rx="4" fill="#F5E642" stroke="#111111" stroke-width="3.5"/>
    <path d="M 134 102 C 144 102, 144 118, 134 118" fill="none" stroke="#111111" stroke-width="3.5"/>
    <!-- Steam -->
    <path d="M 110 88 Q 106 80 112 72" fill="none" stroke="#00D4D8" stroke-width="3" stroke-linecap="round"/>
    <path d="M 122 88 Q 126 80 120 72" fill="none" stroke="#00D4D8" stroke-width="3" stroke-linecap="round"/>
  `, '#E6FAF8'),

  'pixel-game-cart.svg': createStickerSvg(`
    <!-- Retro Game Cartridge -->
    <path d="M 60 55 L 140 55 L 140 145 L 60 145 Z" fill="#4A4E69" stroke="#111111" stroke-width="4"/>
    <path d="M 70 55 L 70 48 L 130 48 L 130 55 Z" fill="#22223B" stroke="#111111" stroke-width="3"/>
    <!-- Cartridge Label -->
    <rect x="72" y="75" width="56" height="50" rx="3" fill="#00D4D8" stroke="#111111" stroke-width="3"/>
    <circle cx="100" cy="98" r="14" fill="#F5E642" stroke="#111111" stroke-width="2.5"/>
    <!-- 8-bit Heart on Label -->
    <rect x="96" y="94" width="8" height="8" fill="#FF6EB4"/>
    <rect x="92" y="90" width="8" height="6" fill="#FF6EB4"/>
    <rect x="100" y="90" width="8" height="6" fill="#FF6EB4"/>
    <!-- Cart Grips -->
    <line x1="80" y1="63" x2="120" y2="63" stroke="#111111" stroke-width="3"/>
    <line x1="80" y1="68" x2="120" y2="68" stroke="#111111" stroke-width="3"/>
  `, '#FFF4D6'),

  'sleepy-ramen-neko.svg': createStickerSvg(`
    <!-- Ramen Bowl -->
    <path d="M 45 105 Q 100 155 155 105 Z" fill="#FF6EB4" stroke="#111111" stroke-width="4"/>
    <rect x="75" y="138" width="50" height="8" rx="3" fill="#F5E642" stroke="#111111" stroke-width="3"/>
    <!-- Soup & Noodles -->
    <ellipse cx="100" cy="105" rx="55" ry="12" fill="#FFE599" stroke="#111111" stroke-width="3"/>
    <!-- Narutomaki Swirl -->
    <circle cx="130" cy="104" r="8" fill="#FFFFFF" stroke="#111111" stroke-width="2"/>
    <path d="M 128 104 Q 130 101 133 104" stroke="#FF6EB4" stroke-width="2.5" fill="none"/>
    <!-- Sleeping Cat Curled on Edge -->
    <ellipse cx="85" cy="92" rx="26" ry="18" fill="#FFFFFF" stroke="#111111" stroke-width="3.5"/>
    <polygon points="65,80 62,68 74,75" fill="#FFAAA6" stroke="#111111" stroke-width="2.5"/>
    <polygon points="85,75 92,66 95,78" fill="#FFAAA6" stroke="#111111" stroke-width="2.5"/>
    <!-- Sleeping Eyes (v v) -->
    <path d="M 72 92 Q 76 96 80 92" stroke="#111111" stroke-width="2.5" fill="none"/>
    <path d="M 88 92 Q 92 96 96 92" stroke="#111111" stroke-width="2.5" fill="none"/>
    <!-- Chopsticks -->
    <line x1="35" y1="90" x2="165" y2="82" stroke="#8B5A2B" stroke-width="4.5" stroke-linecap="round"/>
  `, '#FFF0F5'),

  'terminal-wizard.svg': createStickerSvg(`
    <!-- Wizard Hat -->
    <path d="M 60 110 L 100 40 L 140 110 Z" fill="#4B0082" stroke="#111111" stroke-width="4"/>
    <ellipse cx="100" cy="110" rx="46" ry="10" fill="#9370DB" stroke="#111111" stroke-width="3.5"/>
    <polygon points="100,55 103,63 110,65 103,68 100,75 97,68 90,65 97,63" fill="#F5E642"/>
    <!-- Beard & Face -->
    <path d="M 75 112 Q 100 155 125 112 Z" fill="#FFFFFF" stroke="#111111" stroke-width="3.5"/>
    <!-- Glowing Terminal Screen -->
    <rect x="68" y="125" width="64" height="42" rx="4" fill="#111111" stroke="#00D4D8" stroke-width="3.5"/>
    <!-- Prompt >_ -->
    <text x="76" y="145" font-family="monospace" font-size="16" font-weight="bold" fill="#00D4D8">&gt;_</text>
    <rect x="96" y="133" width="7" height="13" fill="#00D4D8"/>
  `, '#EAE6FF'),

  'mushroom-house-frog.svg': createStickerSvg(`
    <!-- Toadstool Cap -->
    <path d="M 50 100 A 50 45 0 0 1 150 100 Z" fill="#FF4757" stroke="#111111" stroke-width="4"/>
    <circle cx="75" cy="85" r="9" fill="#FFFFFF"/>
    <circle cx="120" cy="80" r="11" fill="#FFFFFF"/>
    <circle cx="95" cy="65" r="7" fill="#FFFFFF"/>
    <!-- Stem / Frog Underneath -->
    <path d="M 75 100 L 70 145 Q 100 155 130 145 L 125 100 Z" fill="#FFF2DF" stroke="#111111" stroke-width="3.5"/>
    <!-- Frog Face in Window -->
    <ellipse cx="100" cy="120" rx="18" ry="12" fill="#2ED573" stroke="#111111" stroke-width="3"/>
    <circle cx="90" cy="113" r="5" fill="#2ED573" stroke="#111111" stroke-width="2"/>
    <circle cx="110" cy="113" r="5" fill="#2ED573" stroke="#111111" stroke-width="2"/>
    <circle cx="90" cy="113" r="2" fill="#111111"/>
    <circle cx="110" cy="113" r="2" fill="#111111"/>
    <path d="M 96 123 Q 100 126 104 123" stroke="#111111" stroke-width="2" fill="none"/>
  `, '#E8F8F0'),

  'cyberpunk-cassette.svg': createStickerSvg(`
    <!-- Cassette Outer Body -->
    <rect x="42" y="60" width="116" height="80" rx="8" fill="#111111" stroke="#00D4D8" stroke-width="4"/>
    <!-- Cassette Label Area -->
    <rect x="52" y="70" width="96" height="42" rx="4" fill="url(#holo-grad)" stroke="#111111" stroke-width="3"/>
    <!-- Cassette Tape Spools Window -->
    <rect x="68" y="80" width="64" height="22" rx="4" fill="#FFFFFF" stroke="#111111" stroke-width="2.5"/>
    <circle cx="82" cy="91" r="7" fill="#111111"/>
    <circle cx="82" cy="91" r="3" fill="#FFFFFF"/>
    <circle cx="118" cy="91" r="7" fill="#111111"/>
    <circle cx="118" cy="91" r="3" fill="#FFFFFF"/>
    <!-- Screws -->
    <circle cx="48" cy="66" r="2" fill="#FFFFFF"/>
    <circle cx="152" cy="66" r="2" fill="#FFFFFF"/>
    <circle cx="48" cy="134" r="2" fill="#FFFFFF"/>
    <circle cx="152" cy="134" r="2" fill="#FFFFFF"/>
    <text x="60" y="128" font-family="sans-serif" font-weight="900" font-size="10" fill="#F5E642">SIDE-A // 1984</text>
  `, '#E5FBFC'),

  'this-is-fine-mug.svg': createStickerSvg(`
    <!-- Fire Background Flames -->
    <path d="M 50 140 Q 40 90 70 100 Q 80 60 105 85 Q 130 50 135 95 Q 160 85 150 140 Z" 
          fill="#FF7675" stroke="#111111" stroke-width="4"/>
    <path d="M 65 140 Q 60 105 80 110 Q 95 80 115 105 Q 135 90 135 140 Z" 
          fill="#F5E642" stroke="#111111" stroke-width="3"/>
    <!-- Mug in center -->
    <rect x="75" y="98" width="45" height="42" rx="5" fill="#FFFFFF" stroke="#111111" stroke-width="4"/>
    <path d="M 120 106 C 132 106, 132 126, 120 126" fill="none" stroke="#111111" stroke-width="4"/>
    <!-- Cute Happy Derp Face on Mug -->
    <circle cx="88" cy="115" r="3" fill="#111111"/>
    <circle cx="106" cy="115" r="3" fill="#111111"/>
    <path d="M 94 122 Q 97 127 101 122" stroke="#111111" stroke-width="2.5" fill="none"/>
    <text x="80" y="136" font-family="sans-serif" font-size="7" font-weight="900" fill="#FF7675">IT'S FINE</text>
  `, '#FFF1E6'),

  'git-push-force-rocket.svg': createStickerSvg(`
    <!-- Rocket Fire -->
    <polygon points="90,140 100,168 110,140" fill="#F5E642" stroke="#111111" stroke-width="3"/>
    <polygon points="94,140 100,158 106,140" fill="#FF4757"/>
    <!-- Fins -->
    <polygon points="70,120 80,105 80,135" fill="#00D4D8" stroke="#111111" stroke-width="3"/>
    <polygon points="130,120 120,105 120,135" fill="#00D4D8" stroke="#111111" stroke-width="3"/>
    <!-- Body -->
    <path d="M 80 135 L 80 90 Q 100 45 120 90 L 120 135 Z" fill="#FF4757" stroke="#111111" stroke-width="4"/>
    <!-- Window -->
    <circle cx="100" cy="90" r="14" fill="#FFFFFF" stroke="#111111" stroke-width="3"/>
    <circle cx="100" cy="90" r="10" fill="#00D4D8"/>
    <!-- Text / Decal -->
    <text x="85" y="122" font-family="monospace" font-size="9" font-weight="bold" fill="#FFFFFF">-f</text>
  `, '#FCEAEA'),

  'matcha-onigiri.svg': createStickerSvg(`
    <!-- Rice Ball Body -->
    <path d="M 55 135 Q 40 135 60 90 Q 100 45 140 90 Q 160 135 145 135 Z" 
          fill="#FFFFFF" stroke="#111111" stroke-width="4" stroke-linejoin="round"/>
    <!-- Matcha Powder Dusting -->
    <path d="M 80 68 Q 100 52 120 68 Q 115 80 85 80 Z" fill="#A8E6CF" stroke="#111111" stroke-width="2"/>
    <!-- Nori Seaweed Wrap -->
    <path d="M 82 110 L 82 137 L 118 137 L 118 110 Z" fill="#111111" rx="2"/>
    <!-- Eyes and Smile -->
    <circle cx="85" cy="98" r="3.5" fill="#111111"/>
    <circle cx="115" cy="98" r="3.5" fill="#111111"/>
    <ellipse cx="78" cy="103" rx="4" ry="2.5" fill="#FF6EB4"/>
    <ellipse cx="122" cy="103" rx="4" ry="2.5" fill="#FF6EB4"/>
    <path d="M 97 103 Q 100 107 103 103" stroke="#111111" stroke-width="2.5" fill="none"/>
  `, '#F0FFF4'),

  'lofi-sunset-stereo.svg': createStickerSvg(`
    <!-- Boombox Body -->
    <rect x="45" y="80" width="110" height="65" rx="8" fill="#F5E642" stroke="#111111" stroke-width="4"/>
    <!-- Handle -->
    <path d="M 70 80 L 70 60 L 130 60 L 130 80" fill="none" stroke="#111111" stroke-width="5" stroke-linecap="round"/>
    <!-- Speakers -->
    <circle cx="72" cy="115" r="18" fill="#111111" stroke="#FF6EB4" stroke-width="3"/>
    <circle cx="72" cy="115" r="7" fill="#00D4D8"/>
    <circle cx="128" cy="115" r="18" fill="#111111" stroke="#FF6EB4" stroke-width="3"/>
    <circle cx="128" cy="115" r="7" fill="#00D4D8"/>
    <!-- Tape Deck -->
    <rect x="94" y="105" width="22" height="20" fill="#FFFFFF" stroke="#111111" stroke-width="2.5"/>
    <line x1="97" y1="115" x2="113" y2="115" stroke="#111111" stroke-width="2"/>
  `, '#FFF9E6'),

  'retro-arcade-coin.svg': createStickerSvg(`
    <!-- Outer Coin -->
    <circle cx="100" cy="100" r="55" fill="#F5E642" stroke="#111111" stroke-width="4.5"/>
    <circle cx="100" cy="100" r="44" fill="#FFD700" stroke="#111111" stroke-width="3" stroke-dasharray="6,4"/>
    <!-- Pixel Star & 25c Text -->
    <polygon points="100,70 104,80 114,80 106,87 109,97 100,91 91,97 94,87 86,80 96,80" fill="#FFFFFF" stroke="#111111" stroke-width="2"/>
    <text x="75" y="124" font-family="'Courier New', monospace" font-size="20" font-weight="900" fill="#111111">25¢</text>
  `, '#FFFDF0'),

  'magic-potion-flask.svg': createStickerSvg(`
    <!-- Cork -->
    <rect x="90" y="52" width="20" height="12" rx="2" fill="#D29054" stroke="#111111" stroke-width="3"/>
    <!-- Flask Neck -->
    <rect x="92" y="64" width="16" height="18" fill="#FFFFFF" stroke="#111111" stroke-width="3"/>
    <!-- Heart Glass Vial -->
    <path d="M 100 82 C 100 82, 140 68, 145 105 C 150 135, 100 155, 100 155 C 100 155, 50 135, 55 105 C 60 68, 100 82, 100 82 Z" 
          fill="#FF6EB4" stroke="#111111" stroke-width="4"/>
    <!-- Bubbles -->
    <circle cx="90" cy="120" r="5" fill="#FFFFFF" opacity="0.8"/>
    <circle cx="112" cy="110" r="4" fill="#FFFFFF" opacity="0.8"/>
    <circle cx="100" cy="132" r="3" fill="#FFFFFF" opacity="0.8"/>
    <polygon points="135,75 137,80 142,82 137,84 135,89 133,84 128,82 133,80" fill="#F5E642"/>
  `, '#FFE6F2'),

  'cyber-hacker-cat.svg': createStickerSvg(`
    <!-- Cat Head -->
    <path d="M 60 90 L 52 55 L 85 75 C 95 72, 105 72, 115 75 L 148 55 L 140 90 C 150 115, 140 145, 100 145 C 60 145, 50 115, 60 90 Z" 
          fill="#111111" stroke="#00D4D8" stroke-width="4"/>
    <!-- Cyber Visor -->
    <path d="M 62 92 L 138 92 L 132 108 L 68 108 Z" fill="#FF6EB4" stroke="#111111" stroke-width="2.5"/>
    <line x1="72" y1="100" x2="128" y2="100" stroke="#FFFFFF" stroke-width="2"/>
    <!-- Nose & Mouth -->
    <polygon points="98,118 102,118 100,121" fill="#FF6EB4"/>
    <path d="M 95 124 Q 100 128 105 124" stroke="#00D4D8" stroke-width="2" fill="none"/>
  `, '#E0F7FA'),

  'space-donut-planet.svg': createStickerSvg(`
    <!-- Outer Donut Dough -->
    <circle cx="100" cy="100" r="50" fill="#E8B888" stroke="#111111" stroke-width="4"/>
    <!-- Pink Glaze -->
    <path d="M 58 100 C 60 80, 75 60, 100 60 C 125 60, 142 80, 142 100 C 135 110, 125 105, 120 112 C 115 118, 105 112, 100 116 C 90 112, 80 120, 75 110 C 65 110, 58 105, 58 100 Z" 
          fill="#FF6EB4" stroke="#111111" stroke-width="3"/>
    <!-- Donut Hole -->
    <circle cx="100" cy="100" r="18" fill="#111111"/>
    <!-- Planet Ring -->
    <ellipse cx="100" cy="100" rx="72" ry="24" fill="none" stroke="#F5E642" stroke-width="6" stroke-dasharray="140, 50" transform="rotate(-20 100 100)"/>
    <!-- Sprinkles -->
    <rect x="75" y="78" width="8" height="3" rx="1.5" fill="#00D4D8" transform="rotate(30 75 78)"/>
    <rect x="115" y="75" width="8" height="3" rx="1.5" fill="#F5E642" transform="rotate(-40 115 75)"/>
    <rect x="125" y="95" width="8" height="3" rx="1.5" fill="#FFFFFF" transform="rotate(20 125 95)"/>
  `, '#F3E8FF'),

  'dumpster-fire-2026.svg': createStickerSvg(`
    <!-- Flames Bursting Out -->
    <path d="M 55 100 Q 50 55 75 70 Q 85 40 100 55 Q 120 35 125 70 Q 145 60 145 100 Z" 
          fill="#FF4757" stroke="#111111" stroke-width="4"/>
    <path d="M 70 100 Q 80 65 100 75 Q 115 55 120 80 Q 130 75 130 100 Z" 
          fill="#F5E642" stroke="#111111" stroke-width="3"/>
    <!-- Green Dumpster Box -->
    <path d="M 52 95 L 148 95 L 140 148 L 60 148 Z" fill="#2ED573" stroke="#111111" stroke-width="4"/>
    <rect x="48" y="90" width="104" height="10" rx="3" fill="#1E90FF" stroke="#111111" stroke-width="3"/>
    <!-- Cute Happy Derp Face on Dumpster -->
    <circle cx="85" cy="120" r="4" fill="#111111"/>
    <circle cx="115" cy="120" r="4" fill="#111111"/>
    <path d="M 95 128 Q 100 134 105 128" stroke="#111111" stroke-width="2.5" fill="none"/>
    <text x="82" y="142" font-family="monospace" font-size="9" font-weight="900" fill="#111111">2026</text>
  `, '#FFEAA7'),

  'bao-bun-cloud.svg': createStickerSvg(`
    <!-- Soft Bun Body -->
    <path d="M 50 125 C 45 90, 80 65, 100 65 C 120 65, 155 90, 150 125 C 145 142, 55 142, 50 125 Z" 
          fill="#FFFDF7" stroke="#111111" stroke-width="4"/>
    <!-- Fold Pinch on Top -->
    <path d="M 94 65 Q 100 75 106 65" stroke="#111111" stroke-width="3" fill="none"/>
    <path d="M 90 70 Q 100 80 110 70" stroke="#111111" stroke-width="3" fill="none"/>
    <!-- Shy Eyes and Blush -->
    <ellipse cx="80" cy="105" rx="3.5" ry="4" fill="#111111"/>
    <ellipse cx="120" cy="105" rx="3.5" ry="4" fill="#111111"/>
    <ellipse cx="70" cy="112" rx="7" ry="4" fill="#FFAAA6"/>
    <ellipse cx="130" cy="112" rx="7" ry="4" fill="#FFAAA6"/>
    <path d="M 96 112 Q 100 116 104 112" stroke="#111111" stroke-width="2.5" fill="none"/>
  `, '#E8F5E9'),

  'synthwave-palm.svg': createStickerSvg(`
    <!-- Neon Sun Behind -->
    <circle cx="100" cy="105" r="38" fill="url(#holo-grad)" stroke="#111111" stroke-width="3.5"/>
    <line x1="65" y1="110" x2="135" y2="110" stroke="#111111" stroke-width="3"/>
    <line x1="68" y1="120" x2="132" y2="120" stroke="#111111" stroke-width="3"/>
    <!-- Silhouette Palm Tree -->
    <path d="M 96 150 Q 94 115 104 88" stroke="#111111" stroke-width="6" fill="none"/>
    <path d="M 104 88 Q 80 80 65 92" stroke="#111111" stroke-width="4.5" fill="none"/>
    <path d="M 104 88 Q 75 96 68 110" stroke="#111111" stroke-width="4.5" fill="none"/>
    <path d="M 104 88 Q 120 75 140 85" stroke="#111111" stroke-width="4.5" fill="none"/>
    <path d="M 104 88 Q 125 90 135 105" stroke="#111111" stroke-width="4.5" fill="none"/>
  `, '#E1BEE7'),

  'octocat-tea-party.svg': createStickerSvg(`
    <!-- Cephalopod Dome -->
    <ellipse cx="100" cy="85" rx="36" ry="30" fill="#9C27B0" stroke="#111111" stroke-width="4"/>
    <!-- Cat Ears -->
    <polygon points="72,66 68,48 85,58" fill="#BA68C8" stroke="#111111" stroke-width="3"/>
    <polygon points="128,66 132,48 115,58" fill="#BA68C8" stroke="#111111" stroke-width="3"/>
    <!-- Face -->
    <ellipse cx="88" cy="86" rx="4" ry="5" fill="#FFFFFF"/>
    <circle cx="88" cy="86" r="3" fill="#111111"/>
    <ellipse cx="112" cy="86" rx="4" ry="5" fill="#FFFFFF"/>
    <circle cx="112" cy="86" r="3" fill="#111111"/>
    <!-- Tentacles with Teacup -->
    <path d="M 72 105 Q 60 125 75 140 Q 85 130 80 110" fill="#BA68C8" stroke="#111111" stroke-width="3"/>
    <path d="M 128 105 Q 140 125 125 140 Q 115 130 120 110" fill="#BA68C8" stroke="#111111" stroke-width="3"/>
    <rect x="92" y="118" width="16" height="12" rx="2" fill="#FFFFFF" stroke="#111111" stroke-width="2.5"/>
  `, '#EDE7F6'),

  'brain-not-found.svg': createStickerSvg(`
    <!-- Pixel Error Window -->
    <rect x="48" y="65" width="104" height="78" rx="4" fill="#FFFFFF" stroke="#111111" stroke-width="4"/>
    <rect x="48" y="65" width="104" height="18" fill="#FF6EB4" stroke="#111111" stroke-width="3"/>
    <circle cx="58" cy="74" r="3" fill="#FFFFFF"/>
    <circle cx="68" cy="74" r="3" fill="#FFFFFF"/>
    <line x1="140" y1="70" x2="146" y2="78" stroke="#111111" stroke-width="2.5"/>
    <line x1="146" y1="70" x2="140" y2="78" stroke="#111111" stroke-width="2.5"/>
    <!-- Error Content -->
    <text x="64" y="105" font-family="'Courier New', monospace" font-size="16" font-weight="900" fill="#FF4757">404 ERROR</text>
    <text x="58" y="125" font-family="'Courier New', monospace" font-size="10" font-weight="bold" fill="#111111">BRAIN NOT FOUND</text>
  `, '#FFF0F3'),

  'holofoil-crystal-heart.svg': createStickerSvg(`
    <!-- Geometric Crystal Heart with Holographic Facets -->
    <polygon points="100,68 126,52 148,74 135,108 100,145 65,108 52,74 74,52" 
             fill="url(#holo-grad)" stroke="#111111" stroke-width="4.5"/>
    <!-- Facet Inner Lines -->
    <line x1="100" y1="68" x2="100" y2="145" stroke="#111111" stroke-width="3"/>
    <line x1="100" y1="95" x2="52" y2="74" stroke="#111111" stroke-width="2.5"/>
    <line x1="100" y1="95" x2="148" y2="74" stroke="#111111" stroke-width="2.5"/>
    <line x1="100" y1="95" x2="65" y2="108" stroke="#111111" stroke-width="2.5"/>
    <line x1="100" y1="95" x2="135" y2="108" stroke="#111111" stroke-width="2.5"/>
    <!-- Prismatic Sparkles -->
    <polygon points="145,50 148,56 154,58 148,60 145,66 142,60 136,58 142,56" fill="#FFFFFF"/>
    <polygon points="55,125 57,129 62,130 57,132 55,136 53,132 48,130 53,129" fill="#FFFFFF"/>
  `, '#F3E5F5'),

  'strawberry-milk-carton.svg': createStickerSvg(`
    <!-- Drink Carton Body -->
    <path d="M 68 85 L 132 85 L 126 148 L 74 148 Z" fill="#FFEBF0" stroke="#111111" stroke-width="4"/>
    <!-- Gable Top -->
    <polygon points="68,85 100,60 132,85" fill="#FF85A2" stroke="#111111" stroke-width="3.5"/>
    <rect x="86" y="52" width="28" height="12" fill="#FFFFFF" stroke="#111111" stroke-width="3"/>
    <!-- Strawberry Icon -->
    <circle cx="100" cy="114" r="14" fill="#FF4757" stroke="#111111" stroke-width="2.5"/>
    <polygon points="94,103 100,98 106,103" fill="#2ED573"/>
    <!-- Japanese Text: いちごミルク -->
    <text x="80" y="138" font-family="sans-serif" font-size="9" font-weight="900" fill="#FF6EB4">MILK</text>
  `, '#FFF0F5'),

  'mech-switch.svg': createStickerSvg(`
    <!-- Switch Housing -->
    <rect x="60" y="85" width="80" height="55" rx="6" fill="#F5E642" stroke="#111111" stroke-width="4"/>
    <!-- Cross Stem -->
    <rect x="92" y="58" width="16" height="32" rx="2" fill="#FF6EB4" stroke="#111111" stroke-width="3.5"/>
    <rect x="84" y="66" width="32" height="14" rx="2" fill="#FF6EB4" stroke="#111111" stroke-width="3.5"/>
    <!-- Switch Pins -->
    <rect x="75" y="140" width="8" height="14" fill="#00D4D8" stroke="#111111" stroke-width="2.5"/>
    <rect x="117" y="140" width="8" height="14" fill="#00D4D8" stroke="#111111" stroke-width="2.5"/>
    <!-- Tactile Bump Symbol -->
    <path d="M 72 108 L 84 96 L 96 112 L 128 112" fill="none" stroke="#111111" stroke-width="3"/>
  `, '#FFF8E1'),

  'cosmic-jellyfish.svg': createStickerSvg(`
    <!-- Bell / Dome -->
    <path d="M 60 98 C 55 60, 145 60, 140 98 C 130 108, 120 102, 115 108 C 105 102, 95 108, 85 102 C 80 108, 70 102, 60 98 Z" 
          fill="#00D4D8" stroke="#111111" stroke-width="4"/>
    <ellipse cx="100" cy="98" rx="35" ry="8" fill="#80DEEA"/>
    <!-- Tentacles -->
    <path d="M 75 105 Q 68 130 80 155" stroke="#FF6EB4" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M 90 105 Q 96 130 88 158" stroke="#F5E642" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M 105 105 Q 112 130 104 158" stroke="#F5E642" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M 120 105 Q 130 130 118 155" stroke="#FF6EB4" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <!-- Cute Eyes -->
    <circle cx="85" cy="85" r="3.5" fill="#111111"/>
    <circle cx="115" cy="85" r="3.5" fill="#111111"/>
    <ellipse cx="78" cy="90" rx="4" ry="2" fill="#FF6EB4"/>
    <ellipse cx="122" cy="90" rx="4" ry="2" fill="#FF6EB4"/>
  `, '#E0F2F1')
};

for (const [filename, svg] of Object.entries(stickers)) {
  fs.writeFileSync(path.join(outDir, filename), svg.trim(), 'utf-8');
}

console.log(`Generated ${Object.keys(stickers).length} vector stickers into public/stickers/`);
