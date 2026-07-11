# setup_personal_pc.ps1
# Ejecutar en PowerShell en la PC personal DESPUES de clonar el repo
# Instala Python (si no esta), dependencias, y guia el deploy a Fly.io

Write-Host "=== Setup Brujula Politica AR ===" -ForegroundColor Cyan

# 1. Verificar Python
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    Write-Host "Python no encontrado. Descargando instalador..." -ForegroundColor Yellow
    $url = "https://www.python.org/ftp/python/3.13.0/python-3.13.0-amd64.exe"
    $installer = "$env:TEMP\python-installer.exe"
    Invoke-WebRequest $url -OutFile $installer
    Write-Host "Ejecutando instalador de Python (seguir las instrucciones)..."
    Start-Process $installer -Wait
    Write-Host "Reinicia PowerShell y vuelve a ejecutar este script." -ForegroundColor Yellow
    exit
} else {
    Write-Host "Python encontrado: $($pythonCmd.Source)" -ForegroundColor Green
}

# 2. Instalar dependencias Python
Write-Host "Instalando dependencias Python..."
pip install -r requirements.txt
if (-not $?) { Write-Host "Error instalando dependencias" -ForegroundColor Red; exit 1 }
Write-Host "Dependencias instaladas OK" -ForegroundColor Green

# 3. Smoke test local
Write-Host "Ejecutando smoke test local..."
$testResult = python -c "
import json, sys
data = json.load(open('backend/data/j1/brujula.json', encoding='utf-8'))
qs = data['questions']
print(f'OK: {len(qs)} preguntas, version {data[chr(34)]version[chr(34)]}')
" 2>&1
Write-Host $testResult

# 4. Instalar flyctl
$flyCmd = Get-Command fly -ErrorAction SilentlyContinue
if (-not $flyCmd) {
    Write-Host "Instalando flyctl..." -ForegroundColor Yellow
    iwr https://fly.io/install.ps1 -useb | iex
    Write-Host "flyctl instalado. Reinicia PowerShell si el comando 'fly' no funciona." -ForegroundColor Yellow
} else {
    Write-Host "flyctl ya instalado: $($flyCmd.Source)" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Setup completo. Proximos pasos ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Crear cuenta en https://fly.io (gratis)"
Write-Host "2. Ejecutar: fly auth login"
Write-Host "3. Ejecutar: fly apps create brujula-ar"
Write-Host "4. Ejecutar: fly volumes create brujula_data --region gru --size 1"
Write-Host ""
Write-Host "--- OPCIONAL: backup con Cloudflare R2 ---"
Write-Host "5. Crear cuenta en https://cloudflare.com"
Write-Host "6. Crear bucket R2 'brujula-backups'"
Write-Host "7. Ejecutar:"
Write-Host '   fly secrets set LITESTREAM_REPLICA_URL="s3://brujula-backups?endpoint=https://TU_ID.r2.cloudflarestorage.com&region=auto" LITESTREAM_ACCESS_KEY_ID="XXX" LITESTREAM_SECRET_ACCESS_KEY="YYY"'
Write-Host ""
Write-Host "--- Deploy ---"
Write-Host "8. fly deploy"
Write-Host ""
Write-Host "URL del piloto: https://brujula-ar.fly.dev"
