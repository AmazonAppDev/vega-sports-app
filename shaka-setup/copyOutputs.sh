#!/usr/bin/env bash

set -e

echo "Starting Shaka Player artifacts integration"

echo "Removing default ShakaPlayer.ts (using custom version instead)"
rm -f shaka-player/shaka-rel/src/shakaplayer/ShakaPlayer.ts # this file is checked in & modified, therefore we don't want its default copied version

echo "Copying custom source files and polyfills to src/w3cmedia/"
cp -R shaka-player/shaka-rel/src/. ../src/w3cmedia/

echo "Copying built Shaka Player distribution files"
cp -R shaka-player/dist/. ../src/w3cmedia/shakaplayer/dist/

echo "Cleaning up obsolete files"
rm -f ../src/w3cmedia/PlayerInterface.ts # obsolete file
rm -f ../src/w3cmedia/shakaplayer/dist/wrapper.js # obsolete file carrying an interpolation literal {% ... %} causing a syntax error

echo "Shaka Player integration completed successfully."
