#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Building with Vite..."
chmod +x node_modules/.bin/vite
npm run build

echo "Build completed successfully!"
