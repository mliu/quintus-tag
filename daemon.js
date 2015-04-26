console.log(process.pid);
require('daemon')();
daemon.daemon('app.js', [], null);
