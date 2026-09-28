# Sidestep Cosmos

A no-AI creative thinking game. Play quick word games to collect sparks, combine them into an idea, and watch each idea become a star in your own 3D galaxy.

Live version: https://claude.ai/artifact/RyECg9Tnqf7Y9zm7nGDYE1

## How it works

1. **Today's challenge**: one small real-world problem, the same for everyone each day.
2. **Games**: Random Words, New Uses and Find the Link. Every answer becomes a spark.
3. **Noticed**: log things that caught your eye and why they worked.
4. **Create**: pick 2–3 sparks and a reason people will notice, name the idea, and watch it form.
5. **Galaxy**: each idea becomes a star with its own generated star picture.

Progress is saved in the browser (localStorage) only.

## Project layout

```
src/
  engine.js          shared game logic, screens and copy
  base.css           shared layout and components
  cosmos.head.html   Cosmos title, fonts and styles
  cosmos.world.js    Cosmos 3D galaxy (three.js) and star-picture art
  paper.*            Paper Workshop version (paused)
build.sh             assembles the standalone pages
cosmos.html          built Cosmos app (generated)
paper.html           built Paper app (generated)
directions.html      style direction board (reference)
sidestep.html        first single-page prototype (reference)
```

## Build

```sh
./build.sh
```

This writes `cosmos.html` and `paper.html`. Open `cosmos.html` in a browser to play. It loads three.js r128 and Google Fonts (Newsreader, Geist) from their CDNs.
