#!/usr/bin/env pwsh

# Script tự động deploy lên GitHub Pages
Write-Host "🚀 SCRIPT DEPLOY LÊN GITHUB PAGES 🚀" -ForegroundColor Magenta
Write-Host "=" * 50 -ForegroundColor Cyan

# Kiểm tra Git
try {
    $gitVersion = git --version
    Write-Host "✅ Git đã được cài đặt: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git chưa được cài đặt. Vui lòng cài đặt Git trước!" -ForegroundColor Red
    Write-Host "Tải Git tại: https://git-scm.com/" -ForegroundColor Yellow
    Read-Host "Nhấn Enter để thoát"
    exit
}

# Hướng dẫn deploy từng bước
Write-Host "`n📝 HƯỚNG DẪN DEPLOY GITHUB PAGES:" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

Write-Host "`n🔹 BƯỚC 1: Tạo Repository trên GitHub" -ForegroundColor Yellow
Write-Host "   1. Đi tới https://github.com/new" -ForegroundColor White
Write-Host "   2. Repository name: '20-10-munn' (hoặc tên bất kỳ)" -ForegroundColor White
Write-Host "   3. Đặt Public ✅" -ForegroundColor White
Write-Host "   4. KHÔNG tick 'Add a README file'" -ForegroundColor White
Write-Host "   5. Click 'Create repository'" -ForegroundColor White

$repoCreated = Read-Host "`n   Đã tạo repository chưa? (y/n)"
if ($repoCreated.ToLower() -ne 'y') {
    Write-Host "Hãy tạo repository trước rồi chạy lại script!" -ForegroundColor Yellow
    Read-Host "Nhấn Enter để thoát"
    exit
}

Write-Host "`n🔹 BƯỚC 2: Nhập thông tin Repository" -ForegroundColor Yellow
$username = Read-Host "   Nhập username GitHub của bạn"
$repoName = Read-Host "   Nhập tên repository vừa tạo"

# Validate input
if ([string]::IsNullOrWhiteSpace($username) -or [string]::IsNullOrWhiteSpace($repoName)) {
    Write-Host "❌ Vui lòng nhập đầy đủ thông tin!" -ForegroundColor Red
    Read-Host "Nhấn Enter để thoát"
    exit
}

$repoUrl = "https://github.com/$username/$repoName.git"
Write-Host "   Repository URL: $repoUrl" -ForegroundColor Green

Write-Host "`n🔹 BƯỚC 3: Khởi tạo Git và push code" -ForegroundColor Yellow
Write-Host "   Đang thực hiện..." -ForegroundColor White

try {
    # Khởi tạo Git repository
    Write-Host "   📁 Khởi tạo Git repository..." -ForegroundColor Cyan
    git init
    
    # Add all files
    Write-Host "   📦 Thêm tất cả files..." -ForegroundColor Cyan
    git add .
    
    # Commit
    Write-Host "   💾 Commit files..." -ForegroundColor Cyan
    git commit -m "🌸 Initial commit - Website chúc mừng 20/10 cho Bé Munn 💖"
    
    # Rename branch to main
    Write-Host "   🌿 Đổi tên branch thành main..." -ForegroundColor Cyan
    git branch -M main
    
    # Add remote origin
    Write-Host "   🔗 Kết nối với GitHub repository..." -ForegroundColor Cyan
    git remote add origin $repoUrl
    
    # Push to GitHub
    Write-Host "   🚀 Đang push lên GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    Write-Host "`n✅ PUSH THÀNH CÔNG!" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ Có lỗi xảy ra: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Có thể bạn cần:" -ForegroundColor Yellow
    Write-Host "- Đăng nhập GitHub trên máy tính" -ForegroundColor White
    Write-Host "- Kiểm tra quyền truy cập repository" -ForegroundColor White
    Write-Host "- Chạy lệnh: git config --global user.email 'your@email.com'" -ForegroundColor White
    Write-Host "- Chạy lệnh: git config --global user.name 'Your Name'" -ForegroundColor White
    Read-Host "Nhấn Enter để tiếp tục"
}

Write-Host "`n🔹 BƯỚC 4: Kích hoạt GitHub Pages" -ForegroundColor Yellow
Write-Host "   1. Đi tới repository: https://github.com/$username/$repoName" -ForegroundColor White
Write-Host "   2. Click tab 'Settings'" -ForegroundColor White
Write-Host "   3. Scroll xuống phần 'Pages' ở sidebar bên trái" -ForegroundColor White
Write-Host "   4. Trong 'Source', chọn 'Deploy from a branch'" -ForegroundColor White
Write-Host "   5. Branch: 'main', Folder: '/ (root)'" -ForegroundColor White
Write-Host "   6. Click 'Save'" -ForegroundColor White

Write-Host "`n🎉 HOÀN THÀNH!" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "🌐 Website sẽ có sẵn tại:" -ForegroundColor Cyan
Write-Host "   https://$username.github.io/$repoName" -ForegroundColor Yellow -BackgroundColor Blue

Write-Host "`n⏰ Lưu ý: GitHub Pages cần 2-5 phút để deploy" -ForegroundColor Yellow
Write-Host "💖 Website chúc mừng 20/10 cho Bé Munn sẵn sàng!" -ForegroundColor Magenta

# Mở repository trên GitHub
$openRepo = Read-Host "`nBạn có muốn mở repository trên GitHub không? (y/n)"
if ($openRepo.ToLower() -eq 'y') {
    Start-Process "https://github.com/$username/$repoName"
}

Read-Host "`nNhấn Enter để thoát"