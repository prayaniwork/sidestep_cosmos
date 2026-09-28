#!/bin/sh
# Assemble the two standalone app pages from shared + skin sources.
# Order: <title> first (must sit in the first 8KB), then shared CSS, then the skin's head so skin rules win.
cd "$(dirname "$0")"
for skin in cosmos paper; do
  {
    head -n 1 src/$skin.head.html
    printf '<style>\n'; cat src/base.css; printf '</style>\n'
    tail -n +2 src/$skin.head.html
    printf '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n'
    printf '<script>\n'; cat src/$skin.world.js; printf '</script>\n'
    printf '<script>\n'; cat src/engine.js; printf '</script>\n'
  } > $skin.html
done
