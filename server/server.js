var express     = require('express'),
    socketio    = require('socket.io');



var app = express.createServer();
var io  = socketio.listen(app);


// Configuration    

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/../../banana-client/lib'));
});

app.configure('development', function () {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    })); 
    
});

app.configure('production', function () {
    app.use(express.errorHandler());     
});


app.listen(2000);
console.log('Banana server listening on port %d in %s mode', app.address().port, app.settings.env);



module.exports = {
    server: app,
    io: io
}
