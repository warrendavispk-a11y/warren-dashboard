#!/bin/bash
# WarrenOS Dashboard startup script
cd /root/warren-dashboard-fresh

# Build the React app
echo "[WarrenOS] Building React app..."
npm run build

# Start the server
echo "[WarrenOS] Starting server on port 4000..."
exec node server.js
