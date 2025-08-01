#!/bin/bash

echo "🚀 Setting up URL Shortener Microservice..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v14 or higher) first."
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend: npm start (runs on http://localhost:3001)"
echo "2. Frontend: cd frontend && npm start (runs on http://localhost:3000)"
echo ""
echo "Or run both simultaneously:"
echo "npm run dev & cd frontend && npm start"
echo ""
echo "📚 Check README.md for Postman testing commands"