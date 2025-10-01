#!/bin/bash
set -e

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build the Next.js app
npm run build
