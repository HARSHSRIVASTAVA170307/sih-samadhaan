#!/bin/bash

# SkillRoute Quick Deployment Script

echo "🚀 SkillRoute Deployment Helper"
echo "================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for deployment"
    git branch -M main
    echo "✅ Git initialized!"
    echo ""
    echo "⚠️  Next steps:"
    echo "1. Create a repository on GitHub"
    echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/skillroute.git"
    echo "3. Run: git push -u origin main"
else
    echo "✅ Git already initialized"
fi

echo ""
echo "📋 Deployment Checklist:"
echo ""
echo "Backend (Render):"
echo "  [ ] Push code to GitHub"
echo "  [ ] Create Web Service on render.com"
echo "  [ ] Set environment variables (OPENAI_API_KEY, Firebase credentials)"
echo "  [ ] Deploy and get backend URL"
echo ""
echo "Frontend (Vercel):"
echo "  [ ] Import project on vercel.com"
echo "  [ ] Set environment variables (Firebase config, VITE_API_URL)"
echo "  [ ] Deploy and get frontend URL"
echo ""
echo "Post-Deployment:"
echo "  [ ] Update CORS with production URLs in backend/app/main.py"
echo "  [ ] Add Vercel domain to Firebase Auth authorized domains"
echo "  [ ] Test the deployment"
echo ""
echo "📖 Full guide: See DEPLOYMENT.md"
echo ""
