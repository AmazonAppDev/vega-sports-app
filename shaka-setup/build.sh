#!/usr/bin/env bash

set -e 

if [[ -n "${SKIP_BUILDING_SHAKA_PLAYER}" ]]; then
 echo "Skipping Shaka Player build (SKIP_BUILDING_SHAKA_PLAYER is set)"
 exit 0;
fi

export VERSION="4.6.18"
export RELEASE="2.12"
echo "Starting Shaka Player v$VERSION-r$RELEASE integration for Vega TV platform"

# Clone shaka repo
if [ ! -d "shaka-player" ]; then
    echo "Cloning official Shaka Player repository from GitHub"
    git clone https://github.com/shaka-project/shaka-player.git
else
    echo "Shaka Player repository already exists, skipping clone"
fi

echo "Entering Shaka Player directory"
cd shaka-player

#Checkout branch from $VERSION tag
{
    echo "Creating Amazon branch 'amz_$VERSION' from tag v$VERSION"
    git checkout -b amz_$VERSION v$VERSION
} || {
    echo "Branch 'amz_$VERSION' already exists, using existing branch"
}

#Copy shaka-rel tarball
echo "Copying custom Shaka Player tarball with Vega TV patches"
cp ../shaka-rel-v$VERSION-r$RELEASE.tar.gz .

#Unpack tarball
echo "Extracting custom patches, polyfills, and source files"
tar -xzf shaka-rel-v$VERSION-r$RELEASE.tar.gz

#Apply patches
{
    echo "Applying 25 custom patches for Vega TV platform compatibility"
    git am shaka-rel/shaka-patch/*.patch -3
} || {
    echo "Custom patches already applied, skipping patch application"
    git am --abort
}

# Build customized Shaka Player
echo "Building customized Shaka Player with Vega build system"
if ! kepler exec python build/all.py; then
    echo "Vega build failed, attempting direct build"
    build/all.py
fi

# return to /shaka-setup
echo "Returning to shaka-setup directory"
cd ..

# ensure // @ts-nocheck is inside the files to be copied so as not to cause linter / compiler problems
echo "Adding TypeScript no-check directives to prevent linting issues"
LINE_TO_ADD="// @ts-nocheck"
DIRECTORIES=('shaka-player/dist' 'shaka-player/shaka-rel/src')

# Iterate over the list of file paths
for DIRECTORY in "${DIRECTORIES[@]}"; do
    find "$DIRECTORY" -type f \( -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
        # maybe the file already contains the line
        if ! grep -qF "$LINE_TO_ADD" "$file"; then
            # Add the line to the top of the file
            { echo "$LINE_TO_ADD"; cat "$file"; } > "$file.tmp" && mv "$file.tmp" "$file"
            echo "Added @ts-nocheck to: $file"
        else
            echo "@ts-nocheck already present in: $file"
        fi
    done
done