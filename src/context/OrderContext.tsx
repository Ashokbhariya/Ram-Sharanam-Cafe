import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Order } from '../data/orders';

interface OrderCtx { orders: Order[]; save: (o: Order) => void; get: (id: string) => Order | undefined; latest: Order | undefined }
const Ctx = createContext<OrderCtx | null>(null);
const KEY = 'rsc-demo-orders-v1';

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
  });
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(orders.slice(0, 5))); } catch { /* ignore */ } }, [orders]);
  const save = useCallback((o: Order) => setOrders((p) => [o, ...p]), []);
  const get = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);
  return <Ctx.Provider value={{ orders, save, get, latest: orders[0] }}>{children}</Ctx.Provider>;
}
export const useOrders = () => { const c = useContext(Ctx); if (!c) throw new Error('OrderProvider missing'); return c; };
