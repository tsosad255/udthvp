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
    title: 'Google AI Pro 1 tháng (share)',
    desc: '2TB drive, sử dụng hiệu quả hơn bộ công cụ google cho việc học tập và làm việc của bạn.',
    priceVND: 0,
    productImage: './spam/gemini.jpeg',   
    qrImage: './spam/QR.jpg',             
    ckNote: 'Đây là gói share qua family, không dùng chung drive và gemini, hãy chuẩn bị gmail chưa tham gia family và điền vào form',
    googleForm: 'https://forms.gle/NWSvvMSRbCv82zyR6',
    detailUrl: 'https://one.google.com/about/google-ai-plans/#plans-table'
  },
  {
    id: 'AI-002',
    title: 'Google AI Pro 3 tháng (share)',
    desc: '2TB drive, sử dụng hiệu quả hơn bộ công cụ google cho việc học tập và làm việc của bạn.',
    priceVND: 10000,
    productImage: './spam/gemini.jpeg',   
    qrImage: './spam/QR.jpg',             
    ckNote: 'Đây là gói share qua family, không dùng chung drive và gemini, hãy chuẩn bị gmail chưa tham gia family và điền vào form',
    googleForm: 'https://forms.gle/hJyUrmWS4BNQs2x96',
    detailUrl: 'https://one.google.com/about/google-ai-plans/#plans-table'
  },
  {
    id: 'AI-003',
    title: 'Google AI Ultra 45 ngày (share)',
    desc: '30TB drive, sử dụng hiệu quả hơn bộ công cụ google cho việc học tập và làm việc của bạn.',
    priceVND: 50000,
    productImage: './spam/ggultr.webp',   
    qrImage: './spam/QR.jpg',             
    ckNote: 'Đây là gói share qua family, không dùng chung drive và gemini, hãy chuẩn bị gmail chưa tham gia family và điền vào form',
    googleForm: '',
    detailUrl: 'https://one.google.com/about/google-ai-plans/#plans-table'
  },
  {
    id: 'AI-0031',
    title: 'Google AI Ultra 45 ngày (Chính chủ)',
    desc: '30TB drive, sử dụng hiệu quả hơn bộ công cụ google cho việc học tập và làm việc của bạn.',
    priceVND: 9999999,
    productImage: './spam/ggultr.webp',   
    qrImage: './spam/QR.jpg',             
    ckNote: 'Gói này hiện chưa sẵn sàng, hãy quay trở lại sau nhé. xin lỗi vì sự bất tiện này!',
    googleForm: '',
    detailUrl: ''
  },
  {
    id: 'AI-004',
    title: 'Chatgpt plus 3 tháng (chính chủ)',
    desc: 'trợ lý thông minh hỗ trợ đắc lực cho học tập và làm việc',
    priceVND: 50000,
    productImage: './spam/gpt3m.png',
    qrImage: './spam/QR.jpg',
    ckNote: 'Đây là gói chính chủ, sau khi chuyển khoản lưu ý phải liên hệ mail hoặc FB để nhận code và video hướng dẫn kích hoạt.',
    googleForm: 'https://forms.gle/5HmaCKbY9bhKpuor8',
    detailUrl: 'https://chatgpt.com/vi-VN/#pricing'
  },
  {
    id: 'AI-005',
    title: 'Chatgpt plus 1 tháng (chính chủ)',
    desc: 'trợ lý thông minh hỗ trợ đắc lực cho học tập và làm việc',
    priceVND: 9999999,
    productImage: './spam/gpt1m.jpg',
    qrImage: './spam/QR.jpg',
    ckNote: 'Đây là gói chính chủ, sau khi chuyển khoản lưu ý phải liên hệ mail hoặc FB để nhận code và video hướng dẫn kích hoạt.',
    googleForm: '',
    detailUrl: ''
  },
  {
    id: 'AI-006',
    title: 'Youtube premium (share)',
    desc: 'Xem video không gián đoạn và nâng cao trãi nghiệm lên tầm cao mới với Youtube prenium',
    priceVND: 15000,
    productImage: './spam/ytbpre.png',
    qrImage: './spam/QR.jpg',
    ckNote: 'Đây là gói share qua family, hãy đảm bảo gmail chưa tham gia family và điền chính xác vào form.',
    googleForm: 'https://forms.gle/JwkMJZ3TrTJWzWzk9',
    detailUrl: ''
  },

  
];

window.money = (v) =>
  new Intl.NumberFormat('vi-VN').format(v) + ' ' + (SITE.currency || 'VND');
