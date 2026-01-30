# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Number Storm is a terminal-based typing practice game for improving number row keyboard skills. It presents 10 random numbers (1-100) one at a time, tracks accuracy and completion time, and provides performance feedback.

## Commands

```bash
# Run the game
pnpm play
# or
node number-storm.js
```

## Architecture

This is a single-file Node.js application (`number-storm.js`) with no external dependencies. It uses only Node's built-in `readline` module and raw mode stdin for terminal interaction.

### Key Components

- **NumberStorm class**: Main game controller handling state, display, and input
- **ANSI colors object**: Terminal color codes for styled output
- **Raw mode input**: Hidden input (characters not echoed) to build muscle memory

### Game Flow

1. `start()` - Welcome screen and instructions
2. `play()` - Generates 10 random numbers, shows ready prompt
3. `startChallenge()` - Begins timer, enters game loop
4. `promptNextNumber()` - Displays current number, handles raw stdin input
5. `gameComplete()` - Shows results with accuracy/time metrics
6. `playAgainPrompt()` - Restart or exit

### Input Handling

The game uses `process.stdin.setRawMode(true)` to capture keystrokes without echo. This allows hidden input and immediate response to 'q' for quit or Ctrl+C for exit.
