# Vercel Database Setup and Migration Script (PowerShell Version)

# Color settings
$GREEN = [ConsoleColor]::Green
$BLUE = [ConsoleColor]::Cyan
$RED = [ConsoleColor]::Red

Write-Host "=== Fashion Inventory Management System - Vercel Deployment Helper ===" -ForegroundColor $BLUE
Write-Host "This script will help you set up Vercel environment and migrate your database" -ForegroundColor $BLUE
Write-Host ""

# Check required tools
Write-Host "Checking required tools..." -ForegroundColor $BLUE
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Error: npm is not installed" -ForegroundColor $RED
    Write-Host "Please install Node.js and npm first: https://nodejs.org/"
    exit 1
}

if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Host "Error: npx is not installed" -ForegroundColor $RED
    Write-Host "Please update your npm version or install npx separately"
    exit 1
}

# Install Vercel CLI
Write-Host "Installing Vercel CLI..." -ForegroundColor $BLUE
npm install -g vercel

# Login to Vercel
Write-Host "Logging in to Vercel..." -ForegroundColor $BLUE
Write-Host "If you are not logged in to Vercel yet, please follow the prompts"
vercel login

# Create temporary environment file
Write-Host "Creating temporary environment file..." -ForegroundColor $BLUE
Copy-Item .env .env.migration

# Prompt user to enter cloud database connection string
Write-Host "Please enter your cloud database connection string:" -ForegroundColor $BLUE
$DB_URL = Read-Host "DATABASE_URL="

# Update temporary environment file
Write-Host "Updating temporary environment file..." -ForegroundColor $BLUE
$envContent = Get-Content .env.migration
$envContent = $envContent -replace 'DATABASE_URL=.*', "DATABASE_URL=`"$DB_URL`""
Set-Content .env.migration $envContent

# Install dotenv-cli
Write-Host "Installing dotenv-cli..." -ForegroundColor $BLUE
npm install -g dotenv-cli

# Create migration
Write-Host "Creating database migration..." -ForegroundColor $BLUE
npx dotenv -e .env.migration -- prisma migrate dev --name init

# Deploy migration
Write-Host "Deploying migration to production environment..." -ForegroundColor $BLUE
npx dotenv -e .env.migration -- prisma migrate deploy

# Ask if data migration is needed
Write-Host "Do you need to migrate existing data? (y/n)" -ForegroundColor $BLUE
$MIGRATE_DATA = Read-Host

if ($MIGRATE_DATA -eq "y" -or $MIGRATE_DATA -eq "Y") {
    Write-Host "Running data seed script..." -ForegroundColor $BLUE
    npx dotenv -e .env.migration -- prisma db seed
}

# Set up Vercel environment variables
Write-Host "Setting up Vercel environment variables..." -ForegroundColor $BLUE
Write-Host "Please follow the prompts to set up DATABASE_URL environment variable"
vercel env add DATABASE_URL

Write-Host "Please enter JWT secret key for authentication"
$JWT_SECRET = Read-Host "JWT_SECRET="
vercel env add JWT_SECRET

# Deploy to Vercel
Write-Host "Do you want to deploy to Vercel now? (y/n)" -ForegroundColor $BLUE
$DEPLOY_NOW = Read-Host

if ($DEPLOY_NOW -eq "y" -or $DEPLOY_NOW -eq "Y") {
    Write-Host "Deploying to Vercel..." -ForegroundColor $BLUE
    vercel --prod
    Write-Host "Deployment completed!" -ForegroundColor $GREEN
} else {
    Write-Host "You can deploy later using the following command:" -ForegroundColor $BLUE
    Write-Host "vercel --prod"
}

# Cleanup
Write-Host "Cleaning up temporary files..." -ForegroundColor $BLUE
Remove-Item .env.migration

Write-Host "Setup completed!" -ForegroundColor $GREEN
Write-Host "If you encounter any issues, please refer to the scripts/deploy-db.md file" -ForegroundColor $BLUE
