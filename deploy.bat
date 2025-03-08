@echo off
echo Starting deployment process for Tangerine Pacman PVP to GitHub Pages...

REM Check if .env file exists
if not exist .env (
  echo Error: .env file not found. Please create one based on .env.example
  exit /b 1
)

REM Install dependencies
echo Installing dependencies...
call npm ci

REM Run tests
echo Running tests...
call npm test -- --watchAll=false

REM If tests fail, exit
if %ERRORLEVEL% neq 0 (
  echo Tests failed. Aborting deployment.
  exit /b 1
)

REM Build for production
echo Building for production...
call npm run build:production

REM Check if build was successful
if not exist build (
  echo Build failed. Aborting deployment.
  exit /b 1
)

REM Deploy to GitHub Pages
echo Deploying to GitHub Pages...
call npm run deploy

echo Deployment completed successfully!
echo Your app should be available at: https://a-hem.github.io/tangerine-pacman-pvp/ 