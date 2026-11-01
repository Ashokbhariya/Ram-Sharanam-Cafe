// MOCK ORDER / TRACKING DATA — everything here is simulated.
import type { CartLine } from '../context/CartContext';

export const TRACKING_STAGES = [
  { id: 'placed', label: 'Order placed', detail: 'Your demo order has been created.' },
  { id: 'accepted', label: 'Order accepted', detail: 'The kitchen has accepted the order (simulated).' },
  { id: 'preparing', label: 'Preparing your food', detail: 'Dosas on the griddle, idlis in the steamer (simulated).' },
  { id: 'ready', label: 'Ready for pickup', detail: 'Packed and waiting for the rider (simulated).' },
  { id: 'onway', label: 'Rider on the way', detail: 'The rider is heading to your address (simulated).' },
  { id: 'delivered', label: 'Delivered', detail: 'Enjoy your meal! (simulated)' },
] as const;

// How long auto-play dwells on each stage (ms). Stage 4 matches the route animation.
export const STAGE_DWELL_MS = [3500, 4000, 5000, 3500, 9500];
export const ROUTE_ANIMATION_MS = 9000;
// Simulated minutes remaining for stages 0–3 (stage 4 counts down with route progress).
export const STAGE_ETA_MIN = [40, 35, 28, 18];

export const MOCK_RIDER = {
  name: 'Sample Rider',
  vehicle: 'Scooter · demo vehicle',
  note: 'Mock rider — contact details are not real.',
};

export interface Customer { name: string; mobile: string; address: string; landmark: string; instructions: string }
export interface Order {
  id: string;
  placedAt: string;
  lines: CartLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  payment: 'online' | 'cod';
  customer: Customer;
}

export const makeOrderId = () => 'RSC-DEMO-' + Math.floor(10000 + Math.random() * 90000);

export const SAMPLE_ORDER: Order = {
  id: 'RSC-DEMO-00000',
  placedAt: new Date().toISOString(),
  lines: [
    { key: 'masala-dosa', itemId: 'masala-dosa', name: 'Masala Dosa', image: '/art/dosa.webp', tint: '#E7B83F', unitPrice: 120, qty: 1, choices: ['Medium'] },
    { key: 'idli-sambar', itemId: 'idli-sambar', name: 'Idli Sambar', image: '/art/idli.webp', tint: '#F3E4C0', unitPrice: 80, qty: 1, choices: [] },
    { key: 'filter-coffee', itemId: 'filter-coffee', name: 'Filter Coffee', image: '/art/filter-coffee.webp', tint: '#CDB08A', unitPrice: 40, qty: 2, choices: [] },
  ],
  subtotal: 280, deliveryFee: 40, total: 320, payment: 'cod',
  customer: { name: 'Sample Customer', mobile: '9XXXXXXXXX', address: 'Sample delivery address, Jaipur', landmark: 'Near sample landmark', instructions: '' },
};
