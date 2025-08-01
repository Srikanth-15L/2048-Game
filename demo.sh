#!/bin/bash

echo "🚀 Logging Middleware Demo"
echo "========================="
echo ""

echo "📝 Starting Test Server (port 3002)..."
npm run test-server &
TEST_SERVER_PID=$!
sleep 2

echo "🌐 Starting Main Application (port 3001)..."
node server.js &
MAIN_SERVER_PID=$!
sleep 3

echo "✅ Both servers are running!"
echo ""

echo "🔍 Testing logging functionality..."
echo ""

echo "1️⃣ Creating a short URL (triggers creation logs)..."
RESPONSE=$(curl -s -X POST http://localhost:3001/shorturls \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}')
echo "Response: $RESPONSE"
echo ""

echo "2️⃣ Accessing the short URL (triggers redirect logs)..."
curl -I http://localhost:3001/shorturls/$(echo $RESPONSE | grep -o '"shortLink":"[^"]*"' | cut -d'/' -f4 | tr -d '"')
echo ""

echo "3️⃣ Requesting stats for non-existent URL (triggers error logs)..."
curl -s http://localhost:3001/shorturls/nonexistent/stats | python3 -m json.tool
echo ""

echo "4️⃣ Viewing all logs from Test Server..."
curl -s "http://localhost:3002/api/logs?limit=20" | python3 -m json.tool
echo ""

echo "5️⃣ Viewing logging statistics..."
curl -s http://localhost:3002/api/stats | python3 -m json.tool
echo ""

echo "📊 Log Distribution:"
echo "- Info logs: HTTP requests, successful operations"
echo "- Error logs: Validation errors, not found errors"
echo "- Warn logs: 404 responses"
echo ""

echo "🧹 Cleaning up..."
kill $TEST_SERVER_PID $MAIN_SERVER_PID 2>/dev/null
echo "✅ Demo completed! Check LOGGING_SETUP.md for full documentation."