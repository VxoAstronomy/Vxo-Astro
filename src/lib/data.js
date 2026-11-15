import { asset } from './storeConfig';

const add = (label, amount = 0, parent = null) => ({ label, add: amount, abs: null, parent });
const abs = (label, amount, parent = null) => ({ label, add: 0, abs: amount, parent });

export const SAMPLE_PRODUCTS = [
  {
    id: 'kinh-phan-xa-diy',
    cat: 'Kính thiên văn',
    name: 'Kính phản xạ DIY',
    price: 400000,
    images: [asset('images/p-telescope.jpg'), asset('images/p-mirror.jpg'), asset('images/p-kit.jpg')],
    desc: 'Kính Newton tự lắp: gương parabol, ống kính in 3D và đế Dobsonian. Chọn đường kính để xem tiêu cự tương thích.',
    specs: [
      'Gương parabol chất lượng cao',
      'Ống kính in 3D PETG bền thời tiết',
      'Đế Dobsonian vận hành êm',
      'Căn chỉnh quang học trước khi giao',
    ],
    options: [
      {
        name: 'Đường kính',
        parent: null,
        values: [add('76mm', 0), add('114mm', 500000), add('150mm', 1500000)],
      },
      {
        name: 'Tiêu cự',
        parent: 'Đường kính',
        values: [
          abs('700mm', 550000, '76mm'),
          abs('900mm', 650000, '76mm'),
          abs('900mm', 1100000, '114mm'),
          abs('550mm', 1400000, '150mm'),
          abs('750mm', 1650000, '150mm'),
          // Thêm sau này: abs('900mm', 1900000, '150mm')
        ],
      },
      {
        name: 'Chân đế',
        parent: 'Đường kính',
        values: [
          add('Không đế', 0),
          add('Dobsonian', 500000, '76mm'),
          add('Dobsonian', 700000, '114mm'),
          add('Dobsonian', 1200000, '150mm'),
        ],
      },
    ],
    stock: null,
    badge: '',
    consult: true,
    featured: true,
  },
  {
    id: 'onstep-tracking',
    cat: 'Tracking',
    name: 'Hệ tracking OnStep',
    price: 200000,
    images: [asset('images/p-onstep.jpg'), asset('images/p-kit.jpg')],
    desc: 'Bám sao tự động cho chân xích đạo, điều khiển từ điện thoại. Giữ vật thể đứng yên trong thị kính.',
    specs: [
      'Điều khiển qua Wi-Fi / Bluetooth',
      'Động cơ bước êm, ít rung',
      'Tương thích chân xích đạo phổ thông',
      'Hỗ trợ cấu hình qua OnStep App',
    ],
    options: [
      {
        name: 'Cấu hình',
        parent: null,
        values: [add('Nguồn', 0), add('Chỉ mạch', 300000), add('Full bộ', 500000)],
      },
    ],
    stock: 4,
    badge: 'Mới',
    consult: false,
    featured: true,
  },
  {
    id: 'kit-in-3d',
    cat: 'Phụ kiện',
    name: 'Bộ kit in 3D làm kính thiên văn',
    price: 100000,
    images: [asset('images/p-kit.jpg'), asset('images/p-telescope.jpg')],
    desc: 'Spider, focuser, mirror cell hoặc full bộ linh kiện in 3D. Giá thay đổi theo đường kính gương và cấu hình.',
    specs: ['Vật liệu PETG', 'Lắp ráp sẵn', 'Bền bỉ ngoài trời', 'Hỗ trợ lắp đặt qua Zalo'],
    options: [
      {
        name: 'Đường kính',
        parent: null,
        values: [add('76mm', 0), add('114mm', 50000), add('150mm', 150000)],
      },
      {
        name: 'Cấu hình',
        parent: 'Đường kính',
        values: [
          abs('Chỉ Spider', 100000, '76mm'),
          abs('Chỉ focuser', 200000, '76mm'),
          abs('Chỉ mirror cell', 250000, '76mm'),
          abs('Chỉ bộ phận in 3D', 500000, '76mm'),
          abs('Full bộ', 550000, '76mm'),
          abs('Chỉ Spider', 150000, '114mm'),
          abs('Chỉ focuser', 250000, '114mm'),
          abs('Chỉ mirror cell', 300000, '114mm'),
          abs('Chỉ bộ phận in 3D', 550000, '114mm'),
          abs('Full bộ', 600000, '114mm'),
          abs('Chỉ Spider', 250000, '150mm'),
          abs('Chỉ focuser', 350000, '150mm'),
          abs('Chỉ mirror cell', 400000, '150mm'),
          abs('Chỉ bộ phận in 3D', 650000, '150mm'),
          abs('Full bộ', 700000, '150mm'),
        ],
      },
    ],
    stock: 7,
    badge: '',
    consult: false,
    featured: true,
  },
];
