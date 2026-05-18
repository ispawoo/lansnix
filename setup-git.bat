@echo off
REM LANsnix Git Setup Script
REM Created by Yasir Ispawoo

echo ========================================
echo    LANsnix Git Setup Helper
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo Then run this script again.
    pause
    exit /b 1
)

echo [OK] Git is installed
echo.

REM Check if already initialized
if exist .git (
    echo [INFO] Git repository already initialized
    echo.
    goto :push
)

REM Initialize Git
echo [STEP 1] Initializing Git repository...
git init
if errorlevel 1 (
    echo [ERROR] Failed to initialize Git
    pause
    exit /b 1
)
echo [OK] Git initialized
echo.

REM Configure Git (if not configured)
git config user.name >nul 2>&1
if errorlevel 1 (
    echo [STEP 2] Git configuration needed
    echo.
    set /p USERNAME="Enter your name: "
    set /p EMAIL="Enter your email: "
    git config --global user.name "%USERNAME%"
    git config --global user.email "%EMAIL%"
    echo [OK] Git configured
    echo.
) else (
    echo [STEP 2] Git already configured
    echo.
)

REM Add files
echo [STEP 3] Adding files to Git...
git add .
if errorlevel 1 (
    echo [ERROR] Failed to add files
    pause
    exit /b 1
)
echo [OK] Files added
echo.

REM Create commit
echo [STEP 4] Creating initial commit...
git commit -m "Initial commit: LANsnix v1.0.0 - Realtime LAN Monitoring Platform"
if errorlevel 1 (
    echo [ERROR] Failed to create commit
    pause
    exit /b 1
)
echo [OK] Commit created
echo.

:push
REM Get GitHub username
echo [STEP 5] GitHub repository setup
echo.
echo Before continuing, make sure you have:
echo 1. Created a GitHub account at https://github.com
echo 2. Created a new repository named "lansnix" at https://github.com/new
echo.
set /p GITHUB_USER="Enter your GitHub username: "

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo.
    echo [STEP 6] Adding GitHub remote...
    git remote add origin https://github.com/%GITHUB_USER%/lansnix.git
    echo [OK] Remote added
) else (
    echo.
    echo [INFO] Remote already exists
)
echo.

REM Rename branch to main
echo [STEP 7] Setting main branch...
git branch -M main
echo [OK] Branch set to main
echo.

REM Push to GitHub
echo [STEP 8] Pushing to GitHub...
echo.
echo You will be prompted for your GitHub credentials:
echo - Username: %GITHUB_USER%
echo - Password: Your GitHub password OR Personal Access Token
echo.
echo If password doesn't work, create a token at:
echo https://github.com/settings/tokens
echo.
pause

git push -u origin main
if errorlevel 1 (
    echo.
    echo [ERROR] Failed to push to GitHub
    echo.
    echo Common issues:
    echo 1. Wrong username or password
    echo 2. Repository doesn't exist on GitHub
    echo 3. Need to use Personal Access Token instead of password
    echo.
    echo Create token at: https://github.com/settings/tokens
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    SUCCESS! 
echo ========================================
echo.
echo Your project is now on GitHub!
echo.
echo View it at: https://github.com/%GITHUB_USER%/lansnix
echo.
echo Next steps:
echo 1. Visit your repository on GitHub
echo 2. Add topics (network-monitoring, golang, nextjs, docker, linux)
echo 3. Take screenshots and add them to docs/screenshots/
echo 4. Share your project!
echo.
pause
