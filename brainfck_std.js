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
    if (reel[current] >= 256) {
      reel[current] = 0 + reel[current];
    }
  }

  this.subtract = function() {
    reel[current] -= 1;
    if (reel[current] < 0) {
      reel[current] = 256 + reel[current];
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

  this.jumpBack = function(idx) {
    for (var k=idx-1, brackets=0; k>0; k--) {
      if (program[k] == ']') {
        brackets += 1;
      } else if (program[k] === '[' && brackets > 0) {
        brackets -= 1;
      } else if (program[k] === '[' && brackets === 0) {
        return k;
      }
    }
    return null;
  }

  this.jumpForward = function(idx) {
    for (var k=idx+1, brackets=0; k<program.length; k++) {
      if (program[k] == '[') {
        brackets += 1;
      } else if (program[k] === ']' && brackets > 0) {
        brackets -= 1;
      } else if (program[k] === ']' && brackets === 0) {
        return k;
      }
    }
    return null;
  }
  
  // ------------------------------------------------ //
  //                    Methods                       //
  // ------------------------------------------------ //
  this.start = function() {
    for (var i=0; i<program.length; i++) {
      var jmp = this.cmd(program[i], i);
      if (jmp) i = jmp;
      if (reel.length > 10000) {
        console.log('Tape length exceeded. Quit brainf_ck');
        process.exit()
      }
    }
    console.log('reel: ', reel);
  }

  this.cmd = function(fn, idx) {
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
        if (reel[current] === 0) return this.jumpForward(idx);
        break;
      case ']':
        if (reel[current] !== 0) return this.jumpBack(idx);
        break;
    }
    return null;
  }



}