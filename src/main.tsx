import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/bricolage-grotesque';
import './styles/global.css';
import App from './App';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <OrderProvider>
          <App />
        </OrderProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
