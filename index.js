let fs        = require('fs')
let Brainf_ck = require('./brainfck_std');

let inReel  = fs.readFileSync('in/program_reel.json', 'utf8');
let inInput = fs.readFileSync('in/program_input.txt', 'utf8');
let inFile  = fs.readFileSync('in/program.bf',        'utf8');
inReel  = JSON.parse(inReel).reel;
inInput = inInput.split('');
inFile  = inFile.split('');

// let simReel = new Brainf_ck(inFile, inInput, inReel).start();
// simReel.start();


function random() {
  let bf = `
  >>>++[
      <++++++++[
          <[<++>-]>>[>>]+>>+[
              -[->>+<<<[<[<<]<+>]>[>[>>]]]
              <[>>[-]]>[>[-<<]>[<+<]]+<<
          ]<[>+<-]>>-
      ]<.[-]>>
  ]
  `;


}

let simReel = new Brainf_ck({
  code: '+[,.]',
  input: 'RenoMcDonald',
  limit: 25
}).run();
// let simReel = new Brainf_ck('+[,.]', 'RenoMcDonald', [], {limit: 25}).run();
console.log(simReel);

// let simReel = new Brainf_ck(``);