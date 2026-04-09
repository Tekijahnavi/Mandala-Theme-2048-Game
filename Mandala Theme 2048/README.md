# Mandala 2048 - A Meditative Puzzle Game

A beautiful, modern implementation of the classic 2048 game with a peaceful mandala aesthetic theme.

## Features

### Core Gameplay
- **Classic 2048 Mechanics**: Slide and merge tiles to reach the ultimate mandala (2048)
- **Smooth Controls**: Arrow keys for desktop, swipe gestures for mobile
- **Score System**: Track current score and best score with local storage persistence

### Visual Design
- **Mandala Aesthetic**: Each tile level displays progressively more complex mandala patterns
- **Calming Color Palette**: Soft pastels in light mode, deep purples and golds in dark mode
- **Beautiful Animations**: Smooth tile movements, glowing merge effects, and satisfying transitions
- **Responsive Design**: Optimized for both desktop and mobile devices

### User Experience
- **Dark Mode Toggle**: Switch between light and dark themes
- **Win/Game Over Screens**: Elegant overlays with options to restart or continue
- **Sound Effects**: Subtle chimes and meditation-like sounds for merges
- **Visual Feedback**: Pulse effects, glow animations, and smooth transitions
- **Mobile Vibration**: Haptic feedback on supported devices

## How to Play

1. **Desktop**: Use arrow keys (Up, Down, Left, Right) to move tiles
2. **Mobile**: Swipe in any direction to move tiles
3. **Goal**: Merge tiles with the same mandala patterns to create more complex designs
4. **Win**: Reach the 2048 mandala to complete the game
5. **Challenge**: Try to achieve the highest score possible!

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with animations and transitions
- **Vanilla JavaScript**: Pure JS game logic (no frameworks)
- **Web Audio API**: Dynamic sound effects
- **Local Storage**: Score and theme persistence

### Key Features Implemented
- Grid-based game board (4x4)
- Tile sliding and merging algorithms
- Collision detection and move validation
- Score calculation and tracking
- Touch gesture recognition
- Theme switching with CSS variables
- Responsive breakpoints for mobile devices

### File Structure
```
windsurf-project/
|-- index.html          # Main game HTML structure
|-- styles.css          # Complete styling with mandala aesthetic
|-- script.js           # Game logic and interactions
|-- README.md           # Project documentation
```

## Getting Started

1. **Clone or Download**: Get the project files
2. **Local Server**: Run a simple HTTP server (Python's `http.server` works great)
3. **Open Browser**: Navigate to `http://localhost:3000`
4. **Play**: Use arrow keys or swipe to start playing!

### Running Locally
```bash
# Using Python
python -m http.server 3000

# Using Node.js (if you have http-server installed)
npx http-server -p 3000
```

## Game Mechanics

### Tile Values and Mandala Patterns
- **2**: Simple circle pattern
- **4**: Double circle design
- **8**: Triple circle with thicker borders
- **16**: Four-circle pattern
- **32**: Five circles with shadow effects
- **64**: Six circles with inner glow
- **128**: Seven circles with enhanced glow
- **256**: Eight circles with strong inner shadow
- **512**: Nine circles with maximum glow
- **1024**: Ten circles with intense effects
- **2048**: Ultimate mandala with animated glow

### Scoring System
- Each merge adds the new tile's value to your score
- Best score is saved automatically in local storage
- Score pulses when updated for visual feedback

### Controls
- **Arrow Keys**: Move tiles in corresponding direction
- **Swipe Gestures**: Touch and drag on mobile devices
- **New Game Button**: Reset the game board
- **Theme Toggle**: Switch between light and dark modes

## Browser Compatibility

- **Modern Browsers**: Full support for Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: Optimized for iOS Safari and Android Chrome
- **Touch Support**: Full touch gesture recognition
- **Responsive Design**: Adapts to all screen sizes

## Performance Optimizations

- **Efficient DOM Updates**: Only update changed tiles
- **CSS Transitions**: Hardware-accelerated animations
- **Event Delegation**: Optimized event handling
- **Local Storage**: Fast score persistence
- **Minimal Dependencies**: Pure vanilla JavaScript

## Future Enhancements

- **Leaderboard**: Local high score tracking
- **Undo Feature**: Allow move reversal
- **Custom Themes**: Additional color schemes
- **Sound Settings**: Toggle audio effects
- **Statistics**: Track games played, win rate, etc.

## License

This project is open source and available under the MIT License.

---

Enjoy your meditative gaming experience! The Mandala 2048 game combines the addictive gameplay of 2048 with peaceful, beautiful visuals to create a truly unique puzzle experience.
