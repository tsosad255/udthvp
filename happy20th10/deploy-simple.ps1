# Deploy script cho website 20/10
Write-Host "Deploy Website 20/10 cho Be Munn" -ForegroundColor Magenta

# Check Git
try {
    git --version | Out-Null
    Write-Host "Git OK" -ForegroundColor Green
} catch {
    Write-Host "Can cai dat Git truoc!" -ForegroundColor Red
    pause
    exit
}

Write-Host "`nBuoc 1: Tao repository tren GitHub" -ForegroundColor Yellow
Write-Host "1. Di toi https://github.com/new"
Write-Host "2. Dat ten repo: 20-10-munn"
Write-Host "3. Chon Public"
Write-Host "4. Khong tick Add README"
Write-Host "5. Click Create repository"

$created = Read-Host "`nDa tao repository chua? (y/n)"
if ($created -ne 'y') {
    Write-Host "Hay tao repository truoc!"
    pause
    exit
}

$username = Read-Host "Nhap GitHub username"
$reponame = Read-Host "Nhap ten repository"

Write-Host "`nBuoc 2: Push code len GitHub..." -ForegroundColor Yellow

git init
git add .
git commit -m "Website chuc mung 20/10 cho Be Munn"
git branch -M main
git remote add origin "https://github.com/$username/$reponame.git"
git push -u origin main

Write-Host "`nBuoc 3: Kich hoat GitHub Pages" -ForegroundColor Yellow
Write-Host "1. Di toi: https://github.com/$username/$reponame"
Write-Host "2. Click Settings -> Pages"
Write-Host "3. Source: Deploy from branch"
Write-Host "4. Branch: main, Folder: / (root)"
Write-Host "5. Click Save"

Write-Host "`nWebsite se co tai:" -ForegroundColor Green
Write-Host "https://$username.github.io/$reponame" -BackgroundColor Blue

$openRepo = Read-Host "`nMo repository tren GitHub? (y/n)"
if ($openRepo -eq 'y') {
    Start-Process "https://github.com/$username/$reponame"
}

pause