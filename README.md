# Energy Defender - Educational Arcade

A polished, educational arcade game about metabolism, nutrition, and energy balance. Built with React, Vite, and HTML5 Canvas.

## Features
- **Educational Quizzes**: Interactive questions between levels to teach players about nutrition.
- **Adaptive Difficulty**: Simplified quiz options (True/False) if the player struggles.
- **Power-ups**: Correct answers grant temporary "Double Shot" power-ups.
- **Boss Fights**: Challenging encounters at the end of each level.
- **Local Leaderboard**: Persists top 5 scores using local storage.
- **Mobile Friendly**: Supports touch controls.

## Project Structure
- `src/App.tsx`: Main React component handling the UI overlays and game events.
- `src/game/`: Core game logic.
  - `engine.ts`: The game's state machine and loop.
  - `entities.ts`: Classes for the Player, Enemies, Boss, and projectiles.
  - `constants.ts`: Difficulty settings, levels, and quiz data.
  - `audio.ts`: Web Audio API manager for BGM and SFX.
- `src/index.css`: Tailwind CSS configuration and game-specific animations.

## How to Deploy to Netlify

### Option 1: One-Click Deploy (GitHub)
1. Push this code to a GitHub repository.
2. Link your GitHub repository to Netlify.
3. Netlify will automatically detect the `netlify.toml` file and use the following settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

### Option 2: Manual Upload
1. Run `npm install` to install dependencies.
2. Run `npm run build` to generate the production build.
3. Drag the `dist/` folder into the Netlify "Drag and Drop" upload area.

## Development
```bash
npm install
npm run dev
```

## Credits
Built as an educational tool for dietary balance awareness.
