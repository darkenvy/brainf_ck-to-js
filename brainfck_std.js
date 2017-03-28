module.exports = function Tape(arr, inputFile, options) {
  var unicode = require('./brainfck_codepoints_std');
  var allowQuit = options && options.hasOwnProperty('allowQuit') ? false : true;
  var reel = arr || [0];
  var inputIdx = 0;
  var current = 0;

  // ------------------------------------------------ //
  //                   BF Functions                   //
  // ------------------------------------------------ //

  this.left = function() {
    current -= 1;
    if (current < 0) {
      current = 0;
      console.log('tape indices -1 attempted');
    }
  }

  this.right = function() {
    current += 1;
    while (reel.length < current + 1) {
      reel.push(0);
    }
  }

  this.add = function() {
    reel[current] += 1;
    // Allow wrapping around to zero
    if (reel[current] >= Number.MAX_SAFE_INTEGER) {
      reel[current] = 0 + reel[current];
    }
  }

  this.subtract = function() {
    reel[current] -= 1;
    // Allow wrapping around to 2^53 - 1
    if (reel[current] < 0) {
      reel[current] = Number.MAX_SAFE_INTEGER + reel[current]; // + b/c reel[current will be a negative]
    }
  }

  this.output = function() {
    if (unicode.byInt.hasOwnProperty(reel[current])) {
      console.log(unicode.byInt[ reel[current] ]);
    }
  }

  this.input = function() {
    if (unicode.byChar.hasOwnProperty(inputFile[inputIdx])) {
      reel[current] = unicode.byChar[inputFile[inputIdx]];
    }
    inputIdx += 1;

    // Halt the program safely when out of input
    if (inputIdx > inputFile.length-1 && allowQuit) {
      console.log('Reached the end of the input. Quitting brainf_ck');
      process.exit();
    } else if (inputIdx > inputFile.length-1) {
      reel[current] = 0;
    }
  }
  
  // ------------------------------------------------ //
  //                    Methods                       //
  // ------------------------------------------------ //

  this.cmd = function(fn) {
    switch(fn) {
      case '>':
        this.right();
        break;
      case '<':
        this.left();
        break;
      case '+':
        this.add();
        break;
      case '-':
        this.subtract();
        break;
      case '.':
        this.output();
        break;
      case ',':
        this.input();
        break;
      case '[':
        break;
      case ']':
        break;
    }
  }



}