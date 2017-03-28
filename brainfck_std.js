module.exports = function Tape(program, arr, inputFile, options) {
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
    if (reel[current] >= Number.MAX_SAFE_INTEGER) { // Allow wrapping around to zero
      reel[current] = 0 + reel[current];
    }
  }

  this.subtract = function() {
    reel[current] -= 1;
    if (reel[current] < 0) { // Allow wrapping around to 2^53 - 1
      reel[current] = Number.MAX_SAFE_INTEGER + reel[current];
    }
  }

  this.output = function() {
    console.log(String.fromCharCode(reel[current]));
  }

  this.input = function() {
    reel[current] = inputFile[inputIdx].codePointAt(0);
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
  this.start = function() {
    for (var i=0; i<program.length; i++) {
      var jmp = this.cmd(program[i]);
      if (jmp) i = jmp;
    }
  }

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
        // return 1
        break;
      case ']':
        // return 1
        break;
    }
    return null;
  }



}