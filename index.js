let fs        = require('fs')
let Brainf_ck = require('./brainfck_std');

let inReel  = fs.readFileSync('in/program_reel.json', 'utf8');
let inInput = fs.readFileSync('in/program_input.txt', 'utf8');
let inFile  = fs.readFileSync('in/program.bf',        'utf8');
let outFile = '';
inReel = JSON.parse(inReel).reel;
inFile = inFile.split('');

// --------- Run Brainf_ck here -------- //
// We run the BF code here because we need to know the state
// of the reels to compile into javascript
let simReel = new Brainf_ck(inReel, inInput.split(''));


// --------- Construct base JS -------- //

// Copy brainfck_std to the out folder
// eventually, move the two files into one and minify
// fs.createReadStream('brainfck_std.js')
//   .pipe(fs.createWriteStream('out/brainfck_std.js'));

// In the future, clean inInput to allow litteral ` in file.
outFile += `
  var BrainF_ck = require('./brainfck_std.js');
  var inputReel = [${inReel}];
  var bfInput   = \`${inInput}\`.split('');
  var reel = new BrainF_ck(inputReel, bfInput);
`



// // --------- Helper Functions --------- //
// function findPrevBracket(currIdx) {
//   // We are looking for the [ bracket
//   // We start at the current idx given to us
//   // We NEED to find the matching bracket
//   for (var k=currIdx-1, brackets=0; k>-1; k--) {
//     // every time we find a ], we need to increment brackets
//     // this way, we can find the pairs
//     console.log(k);
//     if (inFile[k] === ']') {
//       console.log('inside 1');
//       brackets += 1;
//     } else if (inFile[k] === '[' && brackets > 0) {
//       console.log('inside 2');
//       // We found a bracket. But it's not ours. So we decrement and continue
//       brackets -= 1;
//     } else if (inFile[k] === '[' && brackets == 0) {
//       console.log('inside 3', 'returning ', k);
//       // only return k if all matching brackets have been paired up
//       return k;
//     }
//   }
//   return null; // We should never see this. For debugging.
// }

// --------- Read BF into JS ---------- //
// Eventually, change the [] to not print to the out file,
// but to runt he brainf_ck here and have the i loop reset
for (let i=0; i<inFile.length; i++) {
  let cmd = inFile[i];
  switch(cmd) {
    case '>':
      simReel.right();
      outFile += 'reel.left();\n';
      break;
    case '<':
      simReel.left();
      outFile += 'reel.right();\n';
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
      simReel.input();
      outFile += 'reel.input();\n';
      break;
    case '[':
      // outFile += '[';
      break;
    case ']':
      i = simReel.findPrevBracket(inFile, i);
      break;
  }
}

fs.writeFile('out/program.js', outFile);