#!/usr/bin/env node

const readline = require('readline');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Text colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

class NumberStorm {
  constructor() {
    this.numbers = [];
    this.userAnswers = [];
    this.currentIndex = 0;
    this.startTime = null;
    this.correctCount = 0;
  }

  generateNumbers() {
    this.numbers = [];
    for (let i = 0; i < 10; i++) {
      this.numbers.push(Math.floor(Math.random() * 100) + 1);
    }
  }

  displayNumbers() {
    console.clear();
    console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}  ${colors.bright}${colors.yellow}        NUMBER STORM CHALLENGE${colors.reset}  ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);
    console.log('You\'ll type 10 numbers, one at a time.');
    console.log('Each number will appear on screen.');
    console.log(`Type them as ${colors.yellow}fast${colors.reset} as you can!`);
    console.log(`Score is tracked - ${colors.green}no penalty for mistakes!${colors.reset}\n`);

    console.log(`${colors.dim}Press ENTER when you're ready to start...${colors.reset}`);
  }

  displayProgress() {
    console.clear();
    console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}  ${colors.bright}${colors.yellow}        NUMBER STORM CHALLENGE${colors.reset}  ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);

    const currentNumber = this.numbers[this.currentIndex];

    console.log(`${colors.white}Type this number:${colors.reset}\n`);
    console.log(`${colors.bright}${colors.blue}╔═════════════╗${colors.reset}`);
    console.log(`${colors.bright}${colors.blue}║${colors.reset}  ${colors.bright}${colors.yellow}    ${String(currentNumber).padStart(3)}${colors.reset}    ${colors.bright}${colors.blue}║${colors.reset}`);
    console.log(`${colors.bright}${colors.blue}╚═════════════╝${colors.reset}`);

    console.log(`\n${colors.dim}-------------------${colors.reset}`);
    console.log(`${colors.cyan}Progress:${colors.reset} ${colors.bright}${this.currentIndex + 1}/${this.numbers.length}${colors.reset}`);
    if (this.startTime) {
      const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
      console.log(`${colors.cyan}Time:${colors.reset} ${colors.bright}${elapsed}s${colors.reset}`);
    }
    console.log('');
  }

  startChallenge() {
    this.startTime = Date.now();
    this.currentIndex = 0;
    this.correctCount = 0;
    this.userAnswers = [];
    this.promptNextNumber();
  }

  promptNextNumber() {
    this.displayProgress();

    process.stdout.write('Your answer: ');

    let answer = '';
    const onData = (key) => {
      const char = key.toString();

      if (char === '\r' || char === '\n') {
        // Enter pressed
        process.stdin.removeListener('data', onData);
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        process.stdin.pause();

        console.log(''); // Move to next line

        const userNumber = parseInt(answer);
        const correctNumber = this.numbers[this.currentIndex];

        this.userAnswers.push({
          expected: correctNumber,
          typed: userNumber,
          correct: userNumber === correctNumber
        });

        if (userNumber === correctNumber) {
          this.correctCount++;
          console.log(`${colors.green}${colors.bright}✓${colors.reset}`);
        } else {
          console.log(`${colors.red}${colors.bright}✗${colors.reset}`);
        }

        this.currentIndex++;

        if (this.currentIndex === this.numbers.length) {
          setTimeout(() => this.gameComplete(), 500);
        } else {
          setTimeout(() => this.promptNextNumber(), 300);
        }
      } else if (char === '\u0003') {
        // Ctrl+C
        process.exit();
      } else if (char === '\u007f' || char === '\b') {
        // Backspace
        if (answer.length > 0) {
          answer = answer.slice(0, -1);
        }
      } else if (/\d/.test(char)) {
        // Only accept digits
        answer += char;
      }
    };

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.on('data', onData);
  }

  gameComplete() {
    const endTime = Date.now();
    const timeTaken = ((endTime - this.startTime) / 1000).toFixed(2);
    const accuracy = ((this.correctCount / this.numbers.length) * 100).toFixed(1);

    console.clear();
    console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}  ${colors.bright}${colors.green}         GAME COMPLETE!${colors.reset}          ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);

    const scoreColor = this.correctCount === this.numbers.length ? colors.green :
                       this.correctCount >= 8 ? colors.yellow : colors.red;
    console.log(`📊 ${colors.cyan}Score:${colors.reset} ${colors.bright}${scoreColor}${this.correctCount}/${this.numbers.length}${colors.reset}`);

    const accuracyColor = accuracy >= 80 ? colors.green : accuracy >= 60 ? colors.yellow : colors.red;
    console.log(`🎯 ${colors.cyan}Accuracy:${colors.reset} ${colors.bright}${accuracyColor}${accuracy}%${colors.reset}`);

    const timeColor = timeTaken < 15 ? colors.green : timeTaken < 30 ? colors.yellow : colors.white;
    console.log(`⏱️  ${colors.cyan}Time:${colors.reset} ${colors.bright}${timeColor}${timeTaken} seconds${colors.reset}\n`);

    console.log(`${colors.white}Results breakdown:${colors.reset}`);
    console.log(`${colors.dim}-------------------${colors.reset}`);
    this.userAnswers.forEach((answer, index) => {
      const status = answer.correct ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
      if (answer.correct) {
        console.log(`  ${colors.dim}${index + 1}.${colors.reset} ${answer.expected} → ${answer.typed} ${status}`);
      } else {
        console.log(`  ${colors.dim}${index + 1}.${colors.reset} ${answer.expected} → ${colors.red}${answer.typed}${colors.reset} ${status} ${colors.dim}(expected ${answer.expected})${colors.reset}`);
      }
    });

    console.log(`\n${colors.dim}-------------------${colors.reset}`);
    if (accuracy == 100) {
      if (timeTaken < 15) {
        console.log(`${colors.bright}${colors.green}🏆 Perfect score + Lightning fast!${colors.reset}`);
      } else if (timeTaken < 30) {
        console.log(`${colors.bright}${colors.green}⭐ Perfect score! Great speed!${colors.reset}`);
      } else {
        console.log(`${colors.bright}${colors.green}🎉 Perfect score! Keep practicing for speed!${colors.reset}`);
      }
    } else if (accuracy >= 80) {
      console.log(`${colors.bright}${colors.yellow}👍 Great accuracy! Keep practicing!${colors.reset}`);
    } else if (accuracy >= 60) {
      console.log(`${colors.bright}${colors.yellow}💪 Good effort! Focus on accuracy!${colors.reset}`);
    } else {
      console.log(`${colors.bright}${colors.cyan}📈 Keep practicing to improve!${colors.reset}`);
    }

    console.log(`\n${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);
    this.playAgainPrompt();
  }

  playAgainPrompt() {
    process.stdout.write(`${colors.cyan}Play again? (y/n):${colors.reset} `);

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.once('data', (key) => {
      const char = key.toString().toLowerCase();
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      console.log(char);

      if (char === 'y') {
        this.play();
      } else {
        console.log('\nThanks for playing Number Storm! 👋\n');
        process.exit(0);
      }
    });
  }

  play() {
    this.generateNumbers();
    this.displayNumbers();

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.once('data', () => {
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      this.startChallenge();
    });
  }

  start() {
    // Check if running in terminal
    if (!process.stdin.isTTY) {
      console.log('This game requires an interactive terminal to run.');
      console.log('Please run it directly in your terminal: node number-storm.js');
      process.exit(1);
    }

    console.clear();
    console.log(`${colors.bright}${colors.cyan}╔═══════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}║${colors.reset}  ${colors.bright}${colors.yellow}        WELCOME TO NUMBER STORM${colors.reset}        ${colors.bright}${colors.cyan}║${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}╚═══════════════════════════════════════════╝${colors.reset}\n`);
    console.log(`${colors.white}How to play:${colors.reset}`);
    console.log(`${colors.dim}1.${colors.reset} One number appears at a time`);
    console.log(`${colors.dim}2.${colors.reset} Type it using your number row`);
    console.log(`${colors.dim}3.${colors.reset} Press Enter to submit`);
    console.log(`${colors.dim}4.${colors.reset} Complete all ${colors.yellow}10 numbers${colors.reset} as fast as you can!`);
    console.log(`${colors.dim}5.${colors.reset} ${colors.green}Mistakes are OK${colors.reset} - keep going for your score!\n`);

    process.stdout.write(`${colors.dim}Press ENTER to begin...${colors.reset}`);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      this.play();
    });
  }
}

const game = new NumberStorm();
game.start();