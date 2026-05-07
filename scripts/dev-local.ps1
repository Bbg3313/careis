# 프로젝트 루트에서 포트 3000의 node 리스너를 정리한 뒤 next dev 실행
$ErrorActionPreference = "Continue"
$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $ProjectRoot

Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object {
  $p = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
  if ($p -and $p.ProcessName -eq "node") {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
  }
}

Start-Sleep -Seconds 1
npm run dev
