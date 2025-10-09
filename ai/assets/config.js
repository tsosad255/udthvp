// Cấu hình chung
window.SITE = {
  currency: 'VND',
  // Link Google Form & CK note mặc định (nếu sản phẩm không khai báo riêng)
  defaultGoogleForm: 'https://forms.gle/ay9HgfWLcqHWLgfPA',
  defaultCkNote: 'Tạm thời hết, hãy để lại mail trong form để nhận thông báo sớm nhất khi có hàng'
};

// Danh sách sản phẩm
window.PRODUCTS = [
  {
    id: 'AI-001',
    title: 'Google AI Pro 1 tháng',
    desc: '2TB drive, sử dụng hiệu quả hơn bộ công cụ google cho việc học tập và làm việc của bạn.',
    priceVND: 10000,
    productImage: './spam/gemini.jpeg',   // ảnh card
    qrImage: './spam/QR.jpg',             // ảnh QR cho popup thanh toán
    ckNote: '',
    googleForm: 'https://forms.gle/your_form_id_here',
    // để trống => sẽ hiện popup "giới thiệu chưa hoàn tất"
    detailUrl: ''
  },
  {
    id: 'AI-002',
    title: 'Gói minh hoạ công nghệ',
    desc: 'Tone tối, hợp nội dung AI/tech.',
    priceVND: 150000,
    productImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    qrImage: './spam/QR.jpg',
    ckNote: '',
    googleForm: 'https://forms.gle/your_form_id_here',
    detailUrl: ''
  },
  {
    id: 'AI-003',
    title: 'Gói social dọc',
    desc: 'Tối ưu thumbnail Reels/Shorts.',
    priceVND: 90000,
    productImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    qrImage: './spam/QR.jpg',
    ckNote: '',
    detailUrl: 'https://sites.google.com/view/your-site/your-page'
  }
];

// helper tiền tệ
window.money = (v) =>
  new Intl.NumberFormat('vi-VN').format(v) + ' ' + (SITE.currency || 'VND');
