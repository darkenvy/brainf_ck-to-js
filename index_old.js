let fs        = require('fs')
let Brainf_ck = require('./brainfck_std');

let inReel  = fs.readFileSync('in/program_reel.json', 'utf8');
let inInput = fs.readFileSync('in/program_input.txt', 'utf8');
let inFile  = fs.readFileSync('in/program.bf',        'utf8');
let outFile = '';
let inputEOF = false;
let infDetect = 1; // Determines how tight to exit app when program_input ends. 1 quits on EOF
inReel = JSON.parse(inReel).reel;
inFile = inFile.split('');

// --------- Run Brainf_ck here -------- //
// We run the BF code here because we need to know the state
// of the reels to compile into javascript
let simReel = new Brainf_ck(inReel, inInput.split(''), {allowQuit: false});


// // --------- Construct base JS -------- //

// // Copy brainfck_std to the out folder
// // eventually, move the two files into one and minify
// fs.createReadStream('brainfck_std.js')
//   .pipe(fs.createWriteStream('out/brainfck_std.js'));

// // In the future, clean inInput to allow litteral ` in file.
// outFile += `
//   var BrainF_ck = require('./brainfck_std.js');
//   var inputReel = [${inReel}];
//   var bfInput   = \`${inInput}\`.split('');
//   var reel = new BrainF_ck(inputReel, bfInput);
// `

// --------- Read BF into JS ---------- //
// Eventually, change the [] to not print to the out file,
// but to runt he brainf_ck here and have the i loop reset
for (let i=0; i<inFile.length; i++) {
  let cmd = inFile[i];
  // console.log('curr: ', i);
  if (infDetect == 0) {
    i=inFile.length;
    console.log('Inf-Loop detected. Finished program');
  }

  switch(cmd) {
    case '>':
      simReel.right();
      outFile += 'reel.right();\n';
      break;
    case '<':
      simReel.left();
      outFile += 'reel.left();\n';
      break;
    case '+':
      simReel.add();
      outFile += 'reel.add();\n';
      break;
    case '-':
      simReel.subtract();
      outFile += 'reel.subtract();\n';
      break;
    case '.':
      simReel.output();
      outFile += 'reel.output();\n';
      break;
    case ',':
      if (inputEOF) {infDetect -= 1; break;}
      outFile += 'reel.input();\n';
      let checkEOF = simReel.input();
      if (checkEOF == -1) inputEOF = true;
      break;
    case '[':
      i = simReel.findNextBracket(inFile, i);
      break;
    case ']':
      i = simReel.findPrevBracket(inFile, i);
      break;
  }
}


// // --------- Truncator before Saving ---------- //

// // Find canceling out phrases

// // Truncate multiples into single command with arguments
// outFile = outFile.replace(/(reel\.add\(\);\n)+/gm, function(m) {
//   return `reel.add(${m.split('\n').length-1})\n`; // crazy way to count the matches
// });

// console.log('wrote file');
// fs.writeFile('out/program.js', outFile);