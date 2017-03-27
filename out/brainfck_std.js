// var ascii is set up in a way so that you can convert integer points to
// the cooresponding ascii. http://cs.stanford.edu/people/miles/iso8859.html
// ie: ascii[33] is the codepoint for '!'

// NOTE: May not need
// var iso88591 = `,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,!,",#,$,%,&,',(,),*,+,,,-,.,
// /,0,1,2,3,4,5,6,7,8,9,:,;,<,=,>,?,@,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,
// V,W,X,Y,Z,[,\\,],_,\`,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,{,|,
// },~,,,,,,,,,,,,,,,,,,,¡,¢,£,¤,¥,¦,§,¨,©,ª,«,¬,,®,¯,°,±,²,³,´,µ,¶,·,¸,¹,º,»,¼,
// ½,¾,¿,À,Á,Â,Ã,Ä,Å,Æ,Ç,È,É,Ê,Ë,Ì,Í,Î,Ï,Ð,Ñ,Ò,Ó,Ô,Õ,Ö,×,Ø,Ù,Ú,Û,Ü,Ý,Þ,ß,à,á,â,ã,
// ä,å,æ,ç,è,é,ê,ë,ì,í,î,ï,ð,ñ,ò,ó,ô,õ,ö,÷,ø,ù,ú,û,ü,ý,þ,ÿ`;
// var ascii = iso88591.split(',');

module.exports = function Tape(arr, input, options) {
  var allowQuit = options && options.hasOwnProperty('allowQuit') ? false : true;
  console.log('allowQuit', allowQuit);
  var reel = arr || [0];
  var inputIdx = 0;
  // var lastUsedIdx = 0;
  this.current = 0;

  // ------------ Methods ------------ //
  this.left = function() {
    if (this.current > 0) {
      this.current -= 1;
    } else {
      console.log('tape indices -1 attempted');
    }
  }

  this.right = function() {
    this.current += 1;
    if (reel.length < this.current + 1) {
      reel.push(0);
    }
  }

  this.add = function() {
    // Wrap around to zero
    if (reel[this.current] >= Number.MAX_SAFE_INTEGER) {
      reel[this.current] = 0;
    } else {
      reel[this.current] += 1;
    }
  }

  this.subtract = function() {
    // Wrap around to 2^53 - 1
    if (reel[this.current] > 0) {
      reel[this.current] -= 1;
    } else {
      reel[this.current] = Number.MAX_SAFE_INTEGER;
    }
  }

  this.output = function() {
    if (reel[this.current] !== null) {
      console.log(reel[this.current]);
      // console.log(ascii[reel[this.current]]);
    }
  }
  this.input = function() {
    reel[this.current] = input[inputIdx];
    inputIdx += 1;

    // Halt the program safely when out of input
    if (inputIdx > input.length-1 && allowQuit) {
      console.log('Reached the end of the input. Quitting brainf_ck');
      process.exit();
    } else if (inputIdx > input.length-1) {
      reel[this.current] = null;
      return -1;
    }
  }

  // ------- Bracket Matching -------- //
  this.findPrevBracket = function(instructions, currIdx) {
    // Only find the previous bracket if the current cell is nonzero
    if (reel[currIdx] == 0) {
      return currIdx;
    }

    // We are looking for the [ bracket. We start at the current idx given to us .We NEED to find the matching bracket
    for (var k=currIdx-1, brackets=0; k>-1; k--) {
      // every time we find a ], we need to increment brackets. this way, we can find the pairs
      if (instructions[k] === ']') {
        brackets += 1;
      } else if (instructions[k] === '[' && brackets > 0) {
        brackets -= 1; // We found a bracket. But it's not ours. So we decrement and continue
      } else if (instructions[k] === '[' && brackets == 0) {
        return k; // only return k if all matching brackets have been paired up
      }
    }

    return null; // We should never see this. For debugging.
  }

  this.findNextBracket = function(instructions, currIdx) {
    if (reel[currIdx] != 0 && reel[currIdx] != undefined) {
      return currIdx;
    }
    // Look for next bracket if the current cell is nonzero
    for (var k=currIdx+1, brackets=0; k<instructions.length; k++) {
      if (instructions[k] === '[') {
        brackets += 1;
      } else if (instructions[k] === ']' && brackets > 0) {
        brackets -= 1;
      } else if (instructions[k] === ']' && brackets == 0) {
        return k;
      }
    }

    return null;
  }


  // ------------ Cleanup ------------ //
  function trimReel() {

  }

  // ------------ Debug　------------ //
  this.view = function() {
    console.log(reel);
  }
}