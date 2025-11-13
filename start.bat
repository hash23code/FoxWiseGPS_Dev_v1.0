@echo off
echo.
echo ========================================
echo    FoxWiseGPS - Lancement
echo ========================================
echo.
echo L'application sera accessible a:
echo    http://localhost:8000
echo.
echo Au premier lancement, vous devrez:
echo   1. Obtenir une cle API gratuite sur:
echo      https://account.mapbox.com/auth/signup/
echo   2. La coller dans l'application
echo.
echo Demarrage du serveur...
echo.

REM Essayer Python 3
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Serveur demarre avec Python
    echo.
    echo Appuyez sur Ctrl+C pour arreter
    echo.
    python -m http.server 8000
    goto :end
)

REM Essayer PHP
php --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Serveur demarre avec PHP
    echo.
    echo Appuyez sur Ctrl+C pour arreter
    echo.
    php -S localhost:8000
    goto :end
)

echo ERREUR: Python requis
echo Telechargez Python depuis: https://www.python.org/downloads/
pause

:end
