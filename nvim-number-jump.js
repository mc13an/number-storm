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

class NvimNumberJump {
  constructor() {
    this.challenges = [];
    this.userAnswers = [];
    this.currentIndex = 0;
    this.startTime = null;
    this.correctCount = 0;
    this.baseDigit = null; // null means all numbers
  }

  generateNumbersWithDigit(digit, count) {
    const numbers = [];
    const candidates = [];

    // Generate all numbers 1-99 that contain the digit
    for (let i = 1; i <= 99; i++) {
      if (digit === null || i.toString().includes(digit.toString())) {
        candidates.push(i);
      }
    }

    // Randomly select 'count' numbers from candidates
    for (let i = 0; i < count && candidates.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      numbers.push(candidates[randomIndex]);
      candidates.splice(randomIndex, 1);
    }

    return numbers;
  }

  generateChallenges() {
    this.challenges = [];
    const numbers = this.generateNumbersWithDigit(this.baseDigit, 10);

    for (const num of numbers) {
      const direction = Math.random() < 0.5 ? 'j' : 'k';
      this.challenges.push({ number: num, direction });
    }
  }

  displaySetup() {
    console.clear();
    console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}  ${colors.bright}${colors.yellow}        NVIM NUMBER JUMP${colors.reset}             ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);
    console.log(`${colors.white}Practice vim-style line jumps!${colors.reset}\n`);
    console.log(`Enter a digit ${colors.yellow}(0-9)${colors.reset} to practice numbers containing that digit,`);
    console.log(`or press ${colors.yellow}ENTER${colors.reset} for all numbers.\n`);
    process.stdout.write(`${colors.cyan}Base digit:${colors.reset} `);
  }

  displayInstructions() {
    console.clear();
    console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}  ${colors.bright}${colors.yellow}        NVIM NUMBER JUMP${colors.reset}             ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);

    if (this.baseDigit !== null) {
      console.log(`Practicing numbers containing: ${colors.bright}${colors.yellow}${this.baseDigit}${colors.reset}\n`);
    } else {
      console.log(`Practicing: ${colors.bright}${colors.yellow}all numbers${colors.reset}\n`);
    }

    console.log('You\'ll see a number and direction arrow.');
    console.log(`Type the number + ${colors.green}j${colors.reset} (down) or ${colors.green}k${colors.reset} (up).`);
    console.log(`Example: ${colors.yellow}15j${colors.reset} or ${colors.yellow}8k${colors.reset}\n`);

    console.log(`${colors.dim}Press ENTER when you're ready to start...${colors.reset}`);
  }

  displayProgress() {
    console.clear();
    console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}  ${colors.bright}${colors.yellow}        NVIM NUMBER JUMP${colors.reset}             ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);

    const challenge = this.challenges[this.currentIndex];
    const directionArrow = challenge.direction === 'j' ? '↓' : '↑';
    const directionColor = challenge.direction === 'j' ? colors.green : colors.magenta;

    console.log(`${colors.white}Type the jump command:${colors.reset}\n`);
    console.log(`${colors.bright}${colors.blue}╔═════════════════╗${colors.reset}`);
    console.log(`${colors.bright}${colors.blue}║${colors.reset}  ${colors.bright}${colors.yellow}  ${String(challenge.number).padStart(2)}${colors.reset}  ${directionColor}${colors.bright}${directionArrow}${colors.reset}       ${colors.bright}${colors.blue}║${colors.reset}`);
    console.log(`${colors.bright}${colors.blue}╚═════════════════╝${colors.reset}`);

    console.log(`\n${colors.dim}-------------------${colors.reset}`);
    console.log(`${colors.cyan}Progress:${colors.reset} ${colors.bright}${this.currentIndex + 1}/${this.challenges.length}${colors.reset}`);
    if (this.startTime) {
      const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
      console.log(`${colors.cyan}Time:${colors.reset} ${colors.bright}${elapsed}s${colors.reset}`);
    }
    console.log(`\n${colors.dim}Press 'q' to quit${colors.reset}`);
  }

  startChallenge() {
    this.startTime = Date.now();
    this.currentIndex = 0;
    this.correctCount = 0;
    this.userAnswers = [];
    this.promptNextChallenge();
  }

  promptNextChallenge() {
    this.displayProgress();

    process.stdout.write('Your answer: ');

    let answer = '';

    const submitAnswer = () => {
      process.stdin.removeListener('data', onData);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdin.pause();

      console.log(''); // Move to next line

      const challenge = this.challenges[this.currentIndex];
      const parsed = this.parseAnswer(answer);

      const numberCorrect = parsed.number === challenge.number;
      const directionCorrect = parsed.direction === challenge.direction;
      const fullyCorrect = numberCorrect && directionCorrect;

      this.userAnswers.push({
        expected: `${challenge.number}${challenge.direction}`,
        typed: answer,
        correct: fullyCorrect,
        numberCorrect,
        directionCorrect
      });

      if (fullyCorrect) {
        this.correctCount++;
        console.log(`${colors.green}${colors.bright}✓${colors.reset}`);
      } else if (numberCorrect && !directionCorrect) {
        console.log(`${colors.yellow}${colors.bright}✗ wrong direction${colors.reset}`);
      } else if (!numberCorrect && directionCorrect) {
        console.log(`${colors.yellow}${colors.bright}✗ wrong number${colors.reset}`);
      } else {
        console.log(`${colors.red}${colors.bright}✗${colors.reset}`);
      }

      this.currentIndex++;

      if (this.currentIndex === this.challenges.length) {
        setTimeout(() => this.gameComplete(), 500);
      } else {
        setTimeout(() => this.promptNextChallenge(), 300);
      }
    };

    const onData = (key) => {
      const char = key.toString().toLowerCase();

      if (char === '\u0003') {
        // Ctrl+C
        process.exit();
      } else if (char === 'q' && answer === '') {
        // Quit only if no digits entered yet
        process.stdin.removeListener('data', onData);
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        console.log(`\n${colors.yellow}Game ended. Thanks for playing!${colors.reset}\n`);
        process.exit(0);
      } else if (char === '\u007f' || char === '\b') {
        // Backspace
        if (answer.length > 0) {
          answer = answer.slice(0, -1);
        }
      } else if (/\d/.test(char)) {
        // Accept digits
        answer += char;
      } else if ((char === 'j' || char === 'k') && answer.length > 0) {
        // j or k pressed after entering digits - submit immediately
        answer += char;
        submitAnswer();
      }
    };

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.on('data', onData);
  }

  parseAnswer(answer) {
    const match = answer.match(/^(\d+)([jk])?$/i);
    if (match) {
      return {
        number: parseInt(match[1]),
        direction: match[2] ? match[2].toLowerCase() : null
      };
    }
    return { number: null, direction: null };
  }

  gameComplete() {
    const endTime = Date.now();
    const timeTaken = ((endTime - this.startTime) / 1000).toFixed(2);
    const accuracy = ((this.correctCount / this.challenges.length) * 100).toFixed(1);

    console.clear();
    console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}  ${colors.bright}${colors.green}         GAME COMPLETE!${colors.reset}          ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);

    const scoreColor = this.correctCount === this.challenges.length ? colors.green :
                       this.correctCount >= 8 ? colors.yellow : colors.red;
    console.log(`📊 ${colors.cyan}Score:${colors.reset} ${colors.bright}${scoreColor}${this.correctCount}/${this.challenges.length}${colors.reset}`);

    const accuracyColor = accuracy >= 80 ? colors.green : accuracy >= 60 ? colors.yellow : colors.red;
    console.log(`🎯 ${colors.cyan}Accuracy:${colors.reset} ${colors.bright}${accuracyColor}${accuracy}%${colors.reset}`);

    const timeColor = timeTaken < 20 ? colors.green : timeTaken < 40 ? colors.yellow : colors.white;
    console.log(`⏱️  ${colors.cyan}Time:${colors.reset} ${colors.bright}${timeColor}${timeTaken} seconds${colors.reset}\n`);

    console.log(`${colors.white}Results breakdown:${colors.reset}`);
    console.log(`${colors.dim}-------------------${colors.reset}`);
    this.userAnswers.forEach((answer, index) => {
      const status = answer.correct ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
      if (answer.correct) {
        console.log(`  ${colors.dim}${index + 1}.${colors.reset} ${answer.expected} → ${answer.typed} ${status}`);
      } else {
        let hint = '';
        if (answer.numberCorrect && !answer.directionCorrect) {
          hint = `${colors.dim}(wrong direction)${colors.reset}`;
        } else if (!answer.numberCorrect && answer.directionCorrect) {
          hint = `${colors.dim}(wrong number)${colors.reset}`;
        }
        console.log(`  ${colors.dim}${index + 1}.${colors.reset} ${answer.expected} → ${colors.red}${answer.typed || '(empty)'}${colors.reset} ${status} ${hint}`);
      }
    });

    console.log(`\n${colors.dim}-------------------${colors.reset}`);
    if (accuracy == 100) {
      if (timeTaken < 20) {
        console.log(`${colors.bright}${colors.green}🏆 Perfect score + Lightning fast!${colors.reset}`);
      } else if (timeTaken < 40) {
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
        console.log('\nThanks for playing Nvim Number Jump! 👋\n');
        process.exit(0);
      }
    });
  }

  play() {
    this.generateChallenges();
    this.displayInstructions();

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

  promptBaseDigit() {
    this.displaySetup();

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();

    const onData = (key) => {
      const char = key.toString();

      if (char === '\u0003') {
        // Ctrl+C
        process.exit();
      } else if (char === '\r' || char === '\n') {
        // Enter with no digit = all numbers
        process.stdin.removeListener('data', onData);
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        console.log('all');
        this.baseDigit = null;
        this.play();
      } else if (/\d/.test(char)) {
        // Single digit entered
        process.stdin.removeListener('data', onData);
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        console.log(char);
        this.baseDigit = parseInt(char);
        this.play();
      }
    };

    process.stdin.on('data', onData);
  }

  start() {
    // Check if running in terminal
    if (!process.stdin.isTTY) {
      console.log('This game requires an interactive terminal to run.');
      console.log('Please run it directly in your terminal: node nvim-number-jump.js');
      process.exit(1);
    }

    console.clear();
    console.log(`${colors.bright}${colors.cyan}╔═══════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}║${colors.reset}  ${colors.bright}${colors.yellow}      WELCOME TO NVIM NUMBER JUMP${colors.reset}      ${colors.bright}${colors.cyan}║${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}╚═══════════════════════════════════════════╝${colors.reset}\n`);
    console.log(`${colors.white}Practice vim-style line navigation!${colors.reset}\n`);
    console.log(`${colors.dim}1.${colors.reset} See a number and direction (${colors.green}↓${colors.reset} or ${colors.magenta}↑${colors.reset})`);
    console.log(`${colors.dim}2.${colors.reset} Type number + ${colors.green}j${colors.reset} (down) or ${colors.magenta}k${colors.reset} (up)`);
    console.log(`${colors.dim}3.${colors.reset} Pressing j/k submits automatically!`);
    console.log(`${colors.dim}4.${colors.reset} Complete all ${colors.yellow}10 jumps${colors.reset} as fast as you can!`);
    console.log(`${colors.dim}5.${colors.reset} ${colors.green}Mistakes are OK${colors.reset} - keep going for your score!`);
    console.log(`${colors.dim}6.${colors.reset} Type ${colors.yellow}'q'${colors.reset} to quit\n`);

    process.stdout.write(`${colors.dim}Press ENTER to continue...${colors.reset}`);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      this.promptBaseDigit();
    });
  }
}

const game = new NvimNumberJump();
game.start();
