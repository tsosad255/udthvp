#!/usr/bin/env pwsh

# Script to open the website locally
Write-Host "🌸 Mở trang web chúc mừng 20/10..." -ForegroundColor Magenta

# Get the current directory
$currentDir = Get-Location

# Check if index.html exists
$indexPath = Join-Path $currentDir "index.html"
if (Test-Path $indexPath) {
    Write-Host "✅ Tìm thấy index.html" -ForegroundColor Green
    Write-Host "🚀 Mở trình duyệt..." -ForegroundColor Yellow
    
    # Open in default browser
    Start-Process $indexPath
    
    Write-Host "🎉 Trang web đã được mở thành công!" -ForegroundColor Green
    Write-Host "💖 Chúc mừng ngày 20/10!" -ForegroundColor Magenta
} else {
    Write-Host "❌ Không tìm thấy file index.html" -ForegroundColor Red
    Write-Host "Hãy chắc chắn bạn đang ở đúng thư mục chứa website" -ForegroundColor Yellow
}

# Instructions for GitHub Pages
Write-Host "`n📝 Hướng dẫn deploy lên GitHub Pages:" -ForegroundColor Cyan
Write-Host "1. Tạo repository mới trên GitHub" -ForegroundColor White
Write-Host "2. Upload tất cả files trong thư mục này" -ForegroundColor White
Write-Host "3. Vào Settings > Pages > Source: Deploy from branch" -ForegroundColor White
Write-Host "4. Chọn branch 'main' và folder '/ (root)'" -ForegroundColor White
Write-Host "5. Website sẽ có sẵn tại: https://[username].github.io/[repo-name]" -ForegroundColor White

Read-Host "`nNhấn Enter để thoát"