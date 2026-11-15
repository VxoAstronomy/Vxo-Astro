import { useEffect } from 'react';
import { CONFIG } from './lib/storeConfig';
import { useHashRoute } from './lib/useHashRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Starfield from './components/Starfield';
import ScrollProgress from './components/ScrollProgress';
import ZaloPanel from './components/ZaloPanel';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import Lightbox from './components/Lightbox';
import ConsultModal from './components/ConsultModal';
import SuccessModal from './components/SuccessModal';
import Toast from './components/Toast';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Request from './pages/Request';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const PAGES = {
  home: Home,
  'san-pham': Shop,
  've-chung-toi': About,
  'yeu-cau': Request,
  'lien-he': Contact,
};

const TITLES = {
  home: `${CONFIG.BRAND.name} ${CONFIG.BRAND.suffix} — ${CONFIG.BRAND.tagline}`,
  'san-pham': 'Sản phẩm',
  've-chung-toi': 'Về chúng tôi',
  'yeu-cau': 'Yêu cầu chế tạo',
  'lien-he': 'Liên hệ',
};

export default function App() {
  const route = useHashRoute();
  const Page = PAGES[route] || NotFound;

  useEffect(() => {
    document.title = TITLES[route] || `Không tìm thấy trang — ${CONFIG.BRAND.name} ${CONFIG.BRAND.suffix}`;
  }, [route]);

  return (
    <div className="relative min-h-screen">
      <Starfield />
      <div className="ambient-glow" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <ScrollProgress />
      <Header route={route} />

      <main key={route} className="page-enter relative z-10">
        <Page />
      </main>

      <Footer />

      <ZaloPanel />
      <CartDrawer />
      <Checkout />
      <Lightbox />
      <ConsultModal />
      <SuccessModal />
      <Toast />
    </div>
  );
}
