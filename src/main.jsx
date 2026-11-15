/* Điểm khởi động của web: gắn <App/> vào thẻ #root trong index.html.
   ShopProvider bọc ngoài để mọi trang đều dùng chung giỏ hàng + sản phẩm. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ShopProvider } from './Store';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShopProvider>
      <App />
    </ShopProvider>
  </StrictMode>,
);
