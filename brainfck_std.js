module.exports = function Tape(options) {
  var program    = options.code  || '';
  var inputFile  = options.input || '';
  var reel       = options.reel  || [0];
  var inputIdx   = 0;
  
  var current    = 0;
  var cycles     = 0;
  var limit      = options.limit || 0;
  var allowQuit  = options && options.hasOwnProperty('allowQuit') ? false : true;
  var outPrint   = '';

  // ------------------------------------------------ //
  //                   BF Functions                   //
  // ------------------------------------------------ //

  this.left = function() {
    current -= 1;
    if (current < 0) current = 0;
  }

  this.right = function() {
    current += 1;
    while (reel.length < current + 1) reel.push(0);
  }

  this.add = function() {
    reel[current] += 1;
    if (reel[current] >= 256) reel[current] = 0 + reel[current];
  }

  this.subtract = function() {
    reel[current] -= 1;
    if (reel[current] < 0) reel[current] = 256 + reel[current];
  }

  this.output = function() {
    outPrint += String.fromCharCode(reel[current]);
  }

  this.input = function() {
    // Halt the program safely when out of input
    if (inputIdx > inputFile.length-1 && allowQuit) return null;
    else if (inputIdx > inputFile.length-1) reel[current] = 0;
    reel[current] = inputFile[inputIdx].codePointAt(0);
    inputIdx += 1;
  }

  this.jumpBack = function(idx) {
    for (var k=idx-1, brackets=0; k>0; k--) {
      if (program[k] == ']') brackets += 1;
      else if (program[k] === '[' && brackets > 0  ) brackets -= 1;
      else if (program[k] === '[' && brackets === 0) return k;
    }
    return null;
  }

  this.jumpForward = function(idx) {
    for (var k=idx+1, brackets=0; k<program.length; k++) {
      if (program[k] == '[') brackets += 1;
      else if (program[k] === ']' && brackets > 0) brackets -= 1;
      else if (program[k] === ']' && brackets === 0) return k;
    }
    return null;
  }
  
  // ------------------------------------------------ //
  //                    Methods                       //
  // ------------------------------------------------ //
  this.run = function() {
    for (var i=0; i<program.length; i++) {
      var jmp = this.cmd(program[i], i);
      if (jmp === null || reel.length > 10000) return outPrint;
      else if (jmp) i = jmp;

      // Manage limit
      if (limit > 0) {
        cycles++;
        if (cycles >= limit) break;
      }
    }
    return outPrint;
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
        if (this.input() === null) return null;
        break;
      case '[':
        if (reel[current] === 0) return this.jumpForward(idx);
        break;
      case ']':
        if (reel[current] !== 0) return this.jumpBack(idx);
        break;
    }
  }
  
}