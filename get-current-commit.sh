#!/usr/bin/env bash
echo "Setting commit hash value"
export REACT_APP_VERSION=$(git rev-parse --short HEAD)

# Create .env if it doesn't exist
[ ! -f .env ] && touch .env

# Update or add REACT_APP_VERSION
sed -i '' -e "/^REACT_APP_VERSION=/d" .env
echo "REACT_APP_VERSION=$REACT_APP_VERSION" >> .env

echo "Current commit hash:"
echo $REACT_APP_VERSION
