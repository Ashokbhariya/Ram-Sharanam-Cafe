// ============================================================
// MOCK MENU — SAMPLE DISHES AND PRICES. NOT VERIFIED.
// The restaurant's real menu, prices, dietary labels and
// availability must be confirmed with the owner and edited here.
// Every component reads from this file only.
// ============================================================
export type CategoryId = 'dosas' | 'idlis' | 'vadas' | 'uttapams' | 'breakfast' | 'rice' | 'meals' | 'beverages';

export interface OptionChoice { id: string; label: string; price: number }
export interface OptionGroup { id: string; label: string; type: 'single' | 'multi'; choices: OptionChoice[] }
export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  image: string;
  tint: string; // background colour behind the image
  price: number;
  available: boolean;
  unavailableNote?: string;
  signature?: boolean;
  dietary?: string[]; // only fill with VERIFIED labels, e.g. ['Vegetarian']
  options?: OptionGroup[];
}
export interface Category { id: CategoryId; label: string; blurb: string; image: string; tint: string }

export const CATEGORIES: Category[] = [
  { id: 'dosas', label: 'Dosas', blurb: 'Crisp, golden, rolled to order.', image: '/art/dosa.webp', tint: '#E7B83F' },
  { id: 'idlis', label: 'Idlis', blurb: 'Soft, steamed, comforting.', image: '/art/idli.webp', tint: '#F3E4C0' },
  { id: 'vadas', label: 'Vadas', blurb: 'Crunch outside, fluffy within.', image: '/art/vada.webp', tint: '#C84B38' },
  { id: 'uttapams', label: 'Uttapams', blurb: 'Thick, topped, griddled.', image: '/art/uttapam-onion.webp', tint: '#9CC27A' },
  { id: 'breakfast', label: 'Breakfast', blurb: 'Pongal, upma and morning plates.', image: '/art/pongal.webp', tint: '#F0D58A' },
  { id: 'rice', label: 'Rice Dishes', blurb: 'Tangy, tempered, satisfying.', image: '/art/lemon-rice.webp', tint: '#F7E6A0' },
  { id: 'meals', label: 'Meals & Combos', blurb: 'A little of everything.', image: '/art/thali.webp', tint: '#D9C4A0' },
  { id: 'beverages', label: 'Beverages', blurb: 'Filter coffee and more.', image: '/art/filter-coffee.webp', tint: '#CDB08A' },
];

const spice: OptionGroup = { id: 'spice', label: 'Spice level', type: 'single', choices: [
  { id: 'mild', label: 'Mild', price: 0 }, { id: 'medium', label: 'Medium', price: 0 }, { id: 'spicy', label: 'Spicy', price: 0 }] };
const dosaExtras: OptionGroup = { id: 'extras', label: 'Extras', type: 'multi', choices: [
  { id: 'butter', label: 'Extra butter', price: 10 }, { id: 'masala', label: 'Extra potato masala', price: 20 }, { id: 'podi', label: 'Podi sprinkle', price: 10 }] };
const sides: OptionGroup = { id: 'sides', label: 'Extra sides', type: 'multi', choices: [
  { id: 'sambar', label: 'Extra sambar', price: 15 }, { id: 'chutney', label: 'Extra chutney', price: 10 }] };
const sugar: OptionGroup = { id: 'sugar', label: 'Sugar', type: 'single', choices: [
  { id: 'regular', label: 'Regular', price: 0 }, { id: 'less', label: 'Less sugar', price: 0 }, { id: 'none', label: 'No sugar', price: 0 }] };
const size: OptionGroup = { id: 'size', label: 'Size', type: 'single', choices: [
  { id: 'reg', label: 'Regular', price: 0 }, { id: 'large', label: 'Large', price: 15 }] };

const mk = (i: Omit<MenuItem, 'available'> & { available?: boolean }): MenuItem => ({ available: true, ...i });

export const MENU: MenuItem[] = [
  mk({ id: 'masala-dosa', name: 'Masala Dosa', category: 'dosas', description: 'Golden crisp dosa folded around spiced potato, with sambar and two chutneys.', image: '/art/dosa.webp', tint: '#E7B83F', price: 120, signature: true, options: [spice, dosaExtras] }),
  mk({ id: 'plain-dosa', name: 'Plain Dosa', category: 'dosas', description: 'Paper-thin, shatteringly crisp, served with sambar and chutneys.', image: '/art/plain-dosa.webp', tint: '#EFD27A', price: 90, signature: true, options: [dosaExtras] }),
  mk({ id: 'mysore-masala-dosa', name: 'Mysore Masala Dosa', category: 'dosas', description: 'Spread with red chilli-garlic chutney inside, filled with potato masala.', image: '/art/mysore-dosa.webp', tint: '#E8A06A', price: 140, signature: true, options: [spice, dosaExtras] }),
  mk({ id: 'rava-dosa', name: 'Rava Dosa', category: 'dosas', description: 'Lacy semolina dosa with a net-like crunch, onion and green chilli.', image: '/art/rava-dosa.webp', tint: '#F0C463', price: 130, options: [dosaExtras] }),
  mk({ id: 'ghee-roast-dosa', name: 'Ghee Roast Dosa', category: 'dosas', description: 'Roasted deep gold with ghee for a rich, brittle bite.', image: '/art/plain-dosa.webp', tint: '#F2D58A', price: 130, available: false, unavailableNote: 'Sold out today (demo)', options: [dosaExtras] }),
  mk({ id: 'idli-sambar', name: 'Idli Sambar', category: 'idlis', description: 'Soft steamed idlis with coconut chutney and hot sambar.', image: '/art/idli.webp', tint: '#F3E4C0', price: 80, signature: true, options: [sides] }),
  mk({ id: 'mini-idli-sambar', name: 'Mini Idli Sambar', category: 'idlis', description: 'Bite-sized idlis soaking in a bowl of ghee-tempered sambar.', image: '/art/mini-idli.webp', tint: '#F0B979', price: 90, options: [sides] }),
  mk({ id: 'podi-idli', name: 'Podi Idli', category: 'idlis', description: 'Idlis tossed in spiced lentil powder and ghee.', image: '/art/podi-idli.webp', tint: '#E9CFA0', price: 100, options: [sides] }),
  mk({ id: 'medu-vada', name: 'Medu Vada', category: 'vadas', description: 'Crisp urad dal doughnuts, fluffy inside, with sambar and chutneys.', image: '/art/vada.webp', tint: '#E4A58F', price: 70, signature: true, options: [sides] }),
  mk({ id: 'sambar-vada', name: 'Sambar Vada', category: 'vadas', description: 'Vadas dunked in hot sambar until just soft.', image: '/art/sambar-vada.webp', tint: '#E8B27A', price: 90 }),
  mk({ id: 'onion-uttapam', name: 'Onion Uttapam', category: 'uttapams', description: 'Thick, soft-centred pancake studded with onion and chilli.', image: '/art/uttapam-onion.webp', tint: '#BFD9A0', price: 110, signature: true, options: [spice, sides] }),
  mk({ id: 'tomato-uttapam', name: 'Tomato Uttapam', category: 'uttapams', description: 'Juicy tomato, coriander and green chilli on a griddled batter round.', image: '/art/uttapam-tomato.webp', tint: '#E9B09E', price: 110, options: [spice, sides] }),
  mk({ id: 'mixed-veg-uttapam', name: 'Mixed Veg Uttapam', category: 'uttapams', description: 'Onion, tomato and chilli together for a fully loaded uttapam.', image: '/art/uttapam-mixed.webp', tint: '#CFE0A9', price: 130, options: [spice, sides] }),
  mk({ id: 'pongal', name: 'Ven Pongal', category: 'breakfast', description: 'Creamy rice and moong dal with pepper, cumin, cashew and ghee.', image: '/art/pongal.webp', tint: '#F4DE95', price: 100, signature: true, options: [sides] }),
  mk({ id: 'upma', name: 'Rava Upma', category: 'breakfast', description: 'Roasted semolina cooked with mustard, curry leaf and vegetables.', image: '/art/upma.webp', tint: '#F6E0A0', price: 80 }),
  mk({ id: 'lemon-rice', name: 'Lemon Rice', category: 'rice', description: 'Turmeric rice with lemon, peanuts, curry leaf and mustard.', image: '/art/lemon-rice.webp', tint: '#F9EBA8', price: 110, signature: true }),
  mk({ id: 'tamarind-rice', name: 'Tamarind Rice', category: 'rice', description: 'Tangy, spiced tamarind rice with roasted peanuts.', image: '/art/tamarind-rice.webp', tint: '#D8B690', price: 110, available: false, unavailableNote: 'Currently unavailable (demo)' }),
  mk({ id: 'curd-rice', name: 'Curd Rice', category: 'rice', description: 'Cooling yoghurt rice tempered with mustard, curry leaf and pomegranate.', image: '/art/curd-rice.webp', tint: '#F1ECDC', price: 100, signature: true }),
  mk({ id: 'south-indian-thali', name: 'South Indian Thali', category: 'meals', description: 'Rice with sambar, rasam, curd, a vegetable curry, payasam and accompaniments.', image: '/art/thali.webp', tint: '#DDCBA8', price: 240, signature: true }),
  mk({ id: 'tiffin-combo', name: 'Tiffin Combo', category: 'meals', description: 'A mini dosa, two idlis and a vada with sambar and chutneys.', image: '/art/combo-tiffin.webp', tint: '#E9D3A6', price: 180, options: [sides] }),
  mk({ id: 'dosa-idli-combo', name: 'Dosa Idli Combo', category: 'meals', description: 'A plain dosa and two idlis with sambar and chutneys.', image: '/art/combo-dosa-idli.webp', tint: '#EAD9B0', price: 170, options: [sides] }),
  mk({ id: 'filter-coffee', name: 'Filter Coffee', category: 'beverages', description: 'Strong decoction, frothy hot milk, served in a davara and tumbler.', image: '/art/filter-coffee.webp', tint: '#CDB08A', price: 40, signature: true, options: [sugar, size] }),
  mk({ id: 'masala-chai', name: 'Masala Chai', category: 'beverages', description: 'Spiced milk tea with ginger and cardamom.', image: '/art/masala-chai.webp', tint: '#D8B88C', price: 30, options: [sugar, size] }),
  mk({ id: 'spiced-buttermilk', name: 'Spiced Buttermilk', category: 'beverages', description: 'Chilled buttermilk with curry leaf, ginger and green chilli.', image: '/art/buttermilk.webp', tint: '#E8E4D2', price: 40 }),
];

export const getItem = (id: string) => MENU.find((m) => m.id === id);
export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);
export const isCategoryId = (v: string | null): v is CategoryId => !!v && CATEGORIES.some((c) => c.id === v);
export const signatureItems = () => MENU.filter((m) => m.signature && m.available);
