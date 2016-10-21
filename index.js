var exec = require('child_process').exec;
var now = require('performance-now');

var cwd = process.argv[2];
try {
  process.chdir(cwd);
} catch (err) {
  // console.log(`chdir: ${err}`);
}

var cmds = process.argv[3];
cmds = (function( input ) {
  return input.split(/['"]/).filter( c => c.match(/^\w+/) );
})( cmds );

var computeTime = (command) => {
  const start = now();

  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        const end = now();

        resolve({ command, result: stdout, start, end, elapsed: Math.floor(end - start)+'ms' });
      }
    })
  });
};

Promise.all( cmds.map(computeTime) )
       .then( (vals) => {
         const outputs = vals.map( val => ({
           title: "🔥 "+val.command+" 🔥  performance: "+val.elapsed,
           subtitle: "⏱ starts: "+val.start+", ends: "+val.end,
           arg: "Result: "+val.result
         }) );

         console.log(
           JSON.stringify({
             items: outputs
           })
         );
       })
       .catch( e => console.log(e) );
