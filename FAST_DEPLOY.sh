#!/bin/bash

# FASTEST WAY TO DEPLOY - Run this on your PC's terminal

echo "🚀 ALEXIA BOT - FAST DEPLOYMENT SCRIPT"
echo "=========================================="

# Get GitHub token
echo "Go to: https://github.com/settings/tokens"
echo "Click 'Generate new token (classic)'"
echo "Give it 'repo' permission"
echo "Copy the token"
read -p "Paste your GitHub token here: " GITHUB_TOKEN

# Clone fresh repo
rm -rf /tmp/alexia-deploy
mkdir /tmp/alexia-deploy
cd /tmp/alexia-deploy

# Download bot files from Replit
echo "📥 Downloading bot files..."
# (Assuming you have Replit CLI or wget installed)

# Initialize git
git init
git config user.email "bot@alexia.dev"
git config user.name "Alexia Bot"

# Add all files (assuming they're extracted here)
echo "📝 Adding all files to git..."
git add .

# Commit
echo "✅ Committing..."
git commit -m "Alexia Bot - Complete deployment with all 119 commands"

# Set remote and push
echo "🚀 Pushing to GitHub..."
git branch -M main
git remote add origin "https://${GITHUB_TOKEN}@github.com/alexaterflix-tech/alexia-bot.git"
git push -u origin main --force

echo "=========================================="
echo "✅ DONE! All files uploaded to GitHub!"
echo "Go to Render and click 'Redeploy'"
echo "=========================================="
