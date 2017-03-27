
  var BrainF_ck = require('./brainfck_std.js');
  var inputReel = [0];
  var bfInput   = `RenoMcDonald`.split('');
  var reel = new BrainF_ck(inputReel, bfInput);
reel.add(10)
reel.right();
reel.add(2)
reel.output();
reel.right();
reel.add(1)
reel.output();
reel.add(7)
reel.output();
reel.output();
reel.add(3)
reel.output();
reel.right();
reel.add(2)
reel.output();
reel.left();
reel.left();
reel.add(15)
reel.output();
reel.right();
reel.output();
reel.add(3)
reel.output();
reel.subtract();
reel.subtract();
reel.subtract();
reel.subtract();
reel.subtract();
reel.subtract();
reel.output();
reel.subtract();
reel.subtract();
reel.subtract();
reel.subtract();
reel.subtract();
reel.subtract();
reel.subtract();
reel.subtract();
reel.output();
reel.right();
reel.add(1)
reel.output();
reel.right();
reel.output();
