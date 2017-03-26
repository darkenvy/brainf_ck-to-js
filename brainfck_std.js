// var ascii is set up in a way so that you can convert integer points to
// the cooresponding ascii. http://cs.stanford.edu/people/miles/iso8859.html
// ie: ascii[33] is the codepoint for '!'
var iso88591 = `,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,!,",#,$,%,&,',(,),*,+,,,-,.,
/,0,1,2,3,4,5,6,7,8,9,:,;,<,=,>,?,@,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,
V,W,X,Y,Z,[,\\,],_,\`,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,{,|,
},~,,,,,,,,,,,,,,,,,,,¡,¢,£,¤,¥,¦,§,¨,©,ª,«,¬,,®,¯,°,±,²,³,´,µ,¶,·,¸,¹,º,»,¼,
½,¾,¿,À,Á,Â,Ã,Ä,Å,Æ,Ç,È,É,Ê,Ë,Ì,Í,Î,Ï,Ð,Ñ,Ò,Ó,Ô,Õ,Ö,×,Ø,Ù,Ú,Û,Ü,Ý,Þ,ß,à,á,â,ã,
ä,å,æ,ç,è,é,ê,ë,ì,í,î,ï,ð,ñ,ò,ó,ô,õ,ö,÷,ø,ù,ú,û,ü,ý,þ,ÿ`;
var ascii = iso88591.split(',');

function Tape(arr) {
  var reel = arr || [0];
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
    console.log(ascii[reel[this.current]]);
  }
  this.input = function(input) {
    reel[this.current] = input;
  }

  // ------------ Cleanup ------------ //
  function trimReel() {

  }

  // ------------ Debug　------------ //
  this.view = function() {
    console.log(reel);
  }
}

var primary = new Tape();
console.log(primary);
primary.right();
primary.add();
primary.output();
primary.view();
// module.exports = {}