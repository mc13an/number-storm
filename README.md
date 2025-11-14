# Number Storm 🌪️

A terminal-based typing practice game focused on improving your number row skills.

## Features

- **Focused Practice** - One number appears at a time for concentrated practice
- **Hidden Input** - Numbers you type don't appear on screen, building muscle memory
- **Score Tracking** - Complete all 10 numbers regardless of mistakes
- **Performance Metrics** - Track accuracy percentage and completion time
- **Detailed Results** - See a breakdown of your performance after each game

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or pnpm

### Clone and Install

```bash
git clone https://github.com/mc13an/number-storm.git
cd number-storm
npm install  # or pnpm install
```

## Usage

Run the game using one of the following commands:

```bash
node number-storm.js
```

or

```bash
npm start  # or pnpm start
```

## How to Play

1. Press ENTER to start the game
2. A number will appear in a box on your screen
3. Type the number using your number row keys
4. Press ENTER to submit your answer
5. Continue through all 10 numbers
6. Review your score and performance at the end

## Game Mechanics

- **10 random numbers** between 1-100
- **Hidden input** - your typing doesn't appear on screen
- **Instant feedback** - ✓ for correct, ✗ for incorrect
- **No game over** - mistakes don't end the game
- **Performance ratings** based on accuracy and speed

## Performance Benchmarks

### Speed Goals
- **Under 15 seconds** - Lightning fast! 🏆
- **15-30 seconds** - Great speed! ⭐
- **30-45 seconds** - Good work! 👍
- **Over 45 seconds** - Keep practicing! 💪

### Accuracy Goals
- **100%** - Perfect score!
- **80%+** - Great accuracy
- **60%+** - Good effort
- **Under 60%** - Focus on accuracy

## Tips for Improvement

1. **Focus on accuracy first** - Speed will come with practice
2. **Use proper finger positioning** - Each finger should have its designated numbers
3. **Don't look at the keyboard** - Build that muscle memory
4. **Practice regularly** - Short, frequent sessions are better than long, infrequent ones
5. **Track your progress** - Note your times and accuracy to see improvement

## Development

This is a simple Node.js application with no external dependencies. The game uses Node's built-in `readline` module for terminal interaction and raw mode for hidden input.

## License

ISC

## Author

Created as a typing practice tool for improving number row proficiency.