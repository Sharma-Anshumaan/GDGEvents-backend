param(
    [string]$ProjectDir = "$env:USERPROFILE\backend",
    [string]$PythonUrl  = "https://www.python.org/ftp/python/3.14.8/python-3.14.8-amd64.exe"
)
$ErrorActionPreference = "Stop"

function Refresh-Path {
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" +
                [System.Environment]::GetEnvironmentVariable("Path","User")
}

Write-Host "== GDGEvents backend setup =="

if (-not (Test-Path "$ProjectDir\manage.py")) {
    throw "manage.py not found in '$ProjectDir'. First copy the project: scp -r backend <user>@<vmip>:  then re-run."
}

# --- 1. Python (per-user install, no admin needed) ---
Refresh-Path
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Python not found - installing 3.14.8 ..."
    $isAdminPython = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
                     ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    $installerMode = if ($isAdminPython) { "InstallAllUsers=1" } else { "InstallAllUsers=0" }
    $installer = "$env:TEMP\python-installer.exe"
    Invoke-WebRequest -Uri $PythonUrl -OutFile $installer
    Start-Process $installer -ArgumentList "/quiet",$installerMode,"PrependPath=1","Include_test=0" -Wait
    Remove-Item $installer -Force
    Refresh-Path
}
python --version

# --- 2. venv + dependencies ---
Set-Location $ProjectDir
if (-not (Test-Path "venv")) { python -m venv venv }
.\venv\Scripts\python -m pip install --upgrade pip --quiet
.\venv\Scripts\pip install -r requirements.txt --quiet

# --- 3. clean cache, apply migrations on the uploaded db.sqlite3 ---
Get-ChildItem -Path . -Recurse -Directory -Filter "__pycache__" |
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
.\venv\Scripts\python manage.py migrate --noinput

# --- 4. write start.bat (waitress serves WSGI on 0.0.0.0:80) ---
@'
@echo off
cd /d "%~dp0"
"%~dp0venv\Scripts\waitress-serve.exe" --host=0.0.0.0 --port=80 --threads=8 backend.wsgi:application >> "%~dp0waitress.log" 2>&1
'@ | Set-Content -Path "$ProjectDir\start.bat" -Encoding ascii

# --- 5. admin bits: firewall rule + startup service task ---
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
           ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
    netsh advfirewall firewall delete rule name="GDGEvents HTTP80" | Out-Null
    netsh advfirewall firewall add rule name="GDGEvents HTTP80" dir=in action=allow protocol=TCP localport=80 | Out-Null

    schtasks /delete /f /tn "GDGEventsBackend" 2>$null | Out-Null
    schtasks /create /f /tn "GDGEventsBackend" /tr "`"$ProjectDir\start.bat`"" /sc onstart /ru SYSTEM | Out-Null
    schtasks /run /tn "GDGEventsBackend" | Out-Null

    Write-Host "Waiting for the server to come up..."
    $up = $false
    for ($i = 0; $i -lt 15; $i++) {
        Start-Sleep 2
        try {
            Invoke-WebRequest -Uri "http://localhost/api/events/" -UseBasicParsing -TimeoutSec 5 | Out-Null
            $up = $true; break
        } catch {
            if ($_.Exception.Response) { $up = $true; break }   # any HTTP response (e.g. 401) = server is up
        }
    }
    if ($up) {
        Write-Host ""
        Write-Host "OK - API is serving on port 80." -ForegroundColor Green
        Write-Host "Remaining steps:"
        Write-Host " 1. In Azure portal: VM -> Networking -> add inbound rule for TCP port 80"
        Write-Host " 2. Test:  http://<your-vm-public-ip>/admin/   and   http://<your-vm-public-ip>/api/login/"
    } else {
        Write-Host "Server did not respond yet - check $ProjectDir\waitress.log" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "Setup done except the admin steps (firewall rule + run-at-boot task)." -ForegroundColor Yellow
    Write-Host "Re-run this script from an ELEVATED PowerShell:"
    Write-Host "  RDP to the VM -> right-click Start -> Windows PowerShell (Admin), then:"
    Write-Host "  powershell -ExecutionPolicy Bypass -File `"$PSCommandPath`" -ProjectDir `"$ProjectDir`""
}
