const $ = (q, ctx=document) => ctx.querySelector(q);
const setModalOpen = (open) => document.documentElement.classList.toggle('modal-open', open);

function init() {
  // footer
  $('#year').textContent = new Date().getFullYear();

  // render danh mục
  renderProducts(PRODUCTS);

  // close modals (dùng data-close)
  document.addEventListener('click', (e) => {
    if (e.target.dataset.close === 'modal') closePayModal();
    if (e.target.dataset.close === 'detail') closeDetailModal();
  });
  // nếu có nút X trong detailModal
  const detailCloseBtn = document.querySelector('#detailModal [data-close="detail"]');
  if (detailCloseBtn) detailCloseBtn.addEventListener('click', closeDetailModal);
}

function renderProducts(list) {
  const host = $('#productGrid');
  host.innerHTML = list.map(p => cardHTML(p)).join('');
  // gán sự kiện sau khi render
  list.forEach(p => {
    $('#buy-' + p.id).addEventListener('click', () => openBuy(p));
    $('#detail-' + p.id).addEventListener('click', () => openDetail(p));
  });
}

function cardHTML(p) {
  return `
    <div class="rounded-xl border p-3">
      <img src="${p.productImage}" alt="${p.title}" class="rounded-xl w-full object-cover aspect-[4/3]" />
      <h3 class="mt-3 text-lg font-semibold">${p.title}</h3>
      <p class="text-sm text-gray-600">${p.desc}</p>
      <div class="mt-2 text-base font-semibold">Giá: <span>${money(p.priceVND)}</span></div>
      <div class="mt-3 flex gap-2">
        <button id="buy-${p.id}" class="px-3 py-2 rounded-xl bg-gray-900 text-white hover:opacity-90">Đặt mua</button>
        <button id="detail-${p.id}" class="px-3 py-2 rounded-xl border hover:bg-gray-50">Xem chi tiết</button>
      </div>
    </div>
  `;
}

// ===== Detail =====
function openDetail(p) {
  const url = (p.detailUrl || '').trim();
  if (url) {
    window.open(url, '_blank', 'noopener');
  } else {
    $('#detailModal').classList.remove('hidden');
    setModalOpen(true);
  }
}
function closeDetailModal() {
  $('#detailModal').classList.add('hidden');
  setModalOpen(false);
}

// ===== Buy / Pay modal =====
function openBuy(p) {
  $('#qrImg').src = p.qrImage;
  $('#payAmount').textContent = money(p.priceVND);
  $('#ckNote').textContent = p.ckNote || SITE.defaultCkNote || '';
  $('#formLink').href = p.googleForm || SITE.defaultGoogleForm || '#';

  $('#payModal').classList.remove('hidden');
  setModalOpen(true);
}
function closePayModal() {
  $('#payModal').classList.add('hidden');
  setModalOpen(false);
}

init();
