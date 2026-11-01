// EDITABLE PLACEHOLDER COPY — no history, founding date, awards or heritage claims are made.
// Replace with verified details from the owner.
export const story = {
  eyebrow: 'Our Story',
  title: 'South Indian comfort, served with character.',
  intro: 'Ram Sharanam Cafe is a South Indian restaurant near 22 Godam, Jaipur. This page is a placeholder for the owner’s own story, in the owner’s own words.',
  paragraphs: [
    'Dosas that arrive crisp and golden. Idlis that stay soft. Sambar and chutneys that make every bite worth another.',
    'Use this space to introduce the people behind the kitchen, how the menu came together and what guests can expect when they sit down. (Editable placeholder — to be supplied by the owner.)',
  ],
  pillars: [
    { word: 'CRISP.', text: 'The sound of a dosa breaking at the edge. Fermented batter, hot griddle, nothing hurried.', image: '/art/scene-crunch.webp', tint: '#E7B83F' },
    { word: 'SOFT.', text: 'Steamed idlis and fluffy vadas — the quiet, comforting side of the South Indian table.', image: '/art/idli.webp', tint: '#F3E4C0' },
    { word: 'SOULFUL.', text: 'Chutneys, sambar and filter coffee: small bowls that turn a plate into a meal.', image: '/art/scene-hero.webp', tint: '#C84B38' },
  ],
};

export interface GalleryImage { id: string; src: string; alt: string; caption: string; kind: 'food' | 'ambience'; tint: string }
// Ambience tiles are illustrated placeholders — replace with real photographs of the restaurant.
export const gallery: GalleryImage[] = [
  { id: 'g1', src: '/art/scene-hero.webp', alt: 'Illustration of a dosa, idlis, a vada and three bowls on a steel plate', caption: 'The full plate', kind: 'food', tint: '#183F32' },
  { id: 'g2', src: '/art/amb-lamp.webp', alt: 'Illustration of a brass lamp glowing among marigold petals', caption: 'Ambience placeholder — brass lamp', kind: 'ambience', tint: '#183F32' },
  { id: 'g3', src: '/art/mysore-dosa.webp', alt: 'Illustration of a Mysore masala dosa with chutneys', caption: 'Mysore Masala Dosa', kind: 'food', tint: '#E8A06A' },
  { id: 'g4', src: '/art/amb-kolam.webp', alt: 'Illustration of a white kolam pattern on a brown floor', caption: 'Ambience placeholder — kolam', kind: 'ambience', tint: '#4A2E24' },
  { id: 'g5', src: '/art/idli.webp', alt: 'Illustration of idlis with chutneys and sambar', caption: 'Idli Sambar', kind: 'food', tint: '#F3E4C0' },
  { id: 'g6', src: '/art/amb-banana-leaf.webp', alt: 'Illustration of rice and sides on a banana leaf', caption: 'Ambience placeholder — banana leaf', kind: 'ambience', tint: '#E7B83F' },
  { id: 'g7', src: '/art/thali.webp', alt: 'Illustration of a South Indian thali', caption: 'South Indian Thali', kind: 'food', tint: '#DDCBA8' },
  { id: 'g8', src: '/art/amb-spices.webp', alt: 'Illustration of bowls of turmeric, chilli, mustard and other spices', caption: 'Ambience placeholder — spices', kind: 'ambience', tint: '#242320' },
  { id: 'g9', src: '/art/filter-coffee.webp', alt: 'Illustration of filter coffee in a steel tumbler and davara', caption: 'Filter Coffee', kind: 'food', tint: '#CDB08A' },
  { id: 'g10', src: '/art/vada.webp', alt: 'Illustration of medu vadas with sambar and chutneys', caption: 'Medu Vada', kind: 'food', tint: '#E4A58F' },
  { id: 'g11', src: '/art/uttapam-mixed.webp', alt: 'Illustration of a mixed vegetable uttapam', caption: 'Mixed Veg Uttapam', kind: 'food', tint: '#CFE0A9' },
  { id: 'g12', src: '/art/lemon-rice.webp', alt: 'Illustration of lemon rice with peanuts and curry leaves', caption: 'Lemon Rice', kind: 'food', tint: '#F9EBA8' },
];
