#!/usr/bin/env node

const readline = require('readline');

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
    console.log('═══════════════════════════════════════════');
    console.log('           NUMBER STORM CHALLENGE           ');
    console.log('═══════════════════════════════════════════\n');
    console.log('You\'ll type 10 numbers, one at a time.');
    console.log('Each number will appear on screen.');
    console.log('Type them as fast as you can!');
    console.log('Score is tracked - no penalty for mistakes!\n');

    console.log('Press ENTER when you\'re ready to start...');
  }

  displayProgress() {
    console.clear();
    console.log('═══════════════════════════════════════════');
    console.log('           NUMBER STORM CHALLENGE           ');
    console.log('═══════════════════════════════════════════\n');

    const currentNumber = this.numbers[this.currentIndex];

    console.log('Type this number:\n');
    console.log(`╔═════════════╗`);
    console.log(`║      ${String(currentNumber).padStart(3)}    ║`);
    console.log(`╚═════════════╝`);

    console.log('\n-------------------');
    console.log(`Progress: ${this.currentIndex + 1}/${this.numbers.length}`);
    if (this.startTime) {
      const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
      console.log(`Time: ${elapsed}s`);
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
        process.stdin.setRawMode(false);
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
          console.log('✓');
        } else {
          console.log('✗');
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

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', onData);
  }

  gameComplete() {
    const endTime = Date.now();
    const timeTaken = ((endTime - this.startTime) / 1000).toFixed(2);
    const accuracy = ((this.correctCount / this.numbers.length) * 100).toFixed(1);

    console.clear();
    console.log('═══════════════════════════════════════════');
    console.log('              GAME COMPLETE!                ');
    console.log('═══════════════════════════════════════════\n');

    console.log(`📊 Score: ${this.correctCount}/${this.numbers.length}`);
    console.log(`🎯 Accuracy: ${accuracy}%`);
    console.log(`⏱️  Time: ${timeTaken} seconds\n`);

    console.log('Results breakdown:');
    console.log('-------------------');
    this.userAnswers.forEach((answer, index) => {
      const status = answer.correct ? '✓' : '✗';
      if (answer.correct) {
        console.log(`  ${index + 1}. ${answer.expected} → ${answer.typed} ${status}`);
      } else {
        console.log(`  ${index + 1}. ${answer.expected} → ${answer.typed} ${status} (expected ${answer.expected})`);
      }
    });

    console.log('\n-------------------');
    if (accuracy == 100) {
      if (timeTaken < 15) {
        console.log('🏆 Perfect score + Lightning fast!');
      } else if (timeTaken < 30) {
        console.log('⭐ Perfect score! Great speed!');
      } else {
        console.log('🎉 Perfect score! Keep practicing for speed!');
      }
    } else if (accuracy >= 80) {
      console.log('👍 Great accuracy! Keep practicing!');
    } else if (accuracy >= 60) {
      console.log('💪 Good effort! Focus on accuracy!');
    } else {
      console.log('📈 Keep practicing to improve!');
    }

    console.log('\n═══════════════════════════════════════════\n');
    this.playAgainPrompt();
  }

  playAgainPrompt() {
    process.stdout.write('Play again? (y/n): ');

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', (key) => {
      const char = key.toString().toLowerCase();
      process.stdin.setRawMode(false);
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

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      this.startChallenge();
    });
  }

  start() {
    console.clear();
    console.log('╔═══════════════════════════════════════════╗');
    console.log('║            WELCOME TO NUMBER STORM        ║');
    console.log('╚═══════════════════════════════════════════╝\n');
    console.log('How to play:');
    console.log('1. One number appears at a time');
    console.log('2. Type it using your number row');
    console.log('3. Press Enter to submit');
    console.log('4. Complete all 10 numbers as fast as you can!');
    console.log('5. Mistakes are OK - keep going for your score!\n');

    process.stdout.write('Press ENTER to begin...');
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