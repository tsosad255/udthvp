# 🚀 Hướng Dẫn Deploy Website 20/10 lên GitHub Pages

## 🎯 Cách 1: Tự động bằng Script (KHUYẾN NGHỊ)

```powershell
.\deploy.ps1
```

Script sẽ hướng dẫn bạn từng bước!

---

## 🎯 Cách 2: Deploy thủ công

### Bước 1: Tạo Repository GitHub
1. Đi tới [GitHub](https://github.com/new)
2. Tạo repository mới:
   - Tên: `20-10-munn` (hoặc tên khác)
   - Chọn **Public**
   - **KHÔNG** tick "Add a README file"
3. Click "Create repository"

### Bước 2: Upload code
Có 2 cách:

#### 🅰️ Dùng Git (Khuyến nghị)
```bash
git init
git add .
git commit -m "🌸 Website chúc mừng 20/10 cho Bé Munn 💖"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git push -u origin main
```

#### 🅱️ Upload trực tiếp
1. Zip tất cả files (trừ file .ps1)
2. Vào repository vừa tạo
3. Click "uploading an existing file"
4. Kéo thả files vào

### Bước 3: Kích hoạt GitHub Pages
1. Vào repository → **Settings**
2. Sidebar trái → **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main**, Folder: **/ (root)**
5. Click **Save**

### Bước 4: Truy cập website
- URL: `https://USERNAME.github.io/REPO-NAME`
- Cần đợi 2-5 phút để GitHub deploy

---

## 🔧 Troubleshooting

### ❌ Lỗi Git không nhận diện
```bash
git config --global user.name "Tên của bạn"
git config --global user.email "email@example.com"
```

### ❌ Lỗi push bị từ chối
- Kiểm tra đã đăng nhập GitHub chưa
- Kiểm tra tên username/repository có đúng không
- Repository phải ở chế độ Public

### ❌ Website không hiển thị
- Đợi 5-10 phút
- Kiểm tra Settings → Pages có được kích hoạt chưa
- File `index.html` phải ở thư mục gốc

---

## 📱 Chia sẻ website

Sau khi deploy thành công, bạn có thể chia sẻ link:
`https://USERNAME.github.io/REPO-NAME`

💖 **Chúc mừng! Website của bạn đã online!** 🎉