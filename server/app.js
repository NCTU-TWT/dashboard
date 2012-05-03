var io      = require('./server').io,
    Socket  = require('./socket').Socket,
    V1      = require('./v1').V1,
    net     = require('net'),
    exec    = require('child_process').exec;
    
    

io.set('log level', 0);

io.sockets.on('connection', function (socket) {

    socket.emit('stream-init', streamStatus);
    socket.emit('server-init', serverStatus);

    //
    //  Streaming
    //

    socket.on('start', function (stream) {    
        streamStatus[stream].status = true;
    });
    
    socket.on('stop', function (stream) {
        streamStatus[stream].status = false;
    });
    
    socket.on('hiccup', function (stream) {
        streamStatus[stream].hiccup = true;
    });
    
    //
    //  Server
    //
    socket.on('on', function (server) {
        serverStatus[server].status = true;        
        exec('forever start ' + serverStatus[server].entry);
    });
    socket.on('off', function (server) {
        serverStatus[server].status = false;
        exec('forever stop ' + serverStatus[server].entry);
    });
    socket.on('restart', function (server) 
        exec('forever restart ' + serverStatus[server].entry);
    });
        
});

//
//  Server
//


serverStatus = {
    'Monitor': {
        status: false,
        entry: '~/node/monitor/index.js'
    },    
    'Dashboard': {
        status: false,
        entry: '~/node/dashboard/server/app.js'
    }
};

checkServer = exec('forever list', function (error, stdout, stderr) {
        
    raw = stdout.trim().split('\n').splice(2);
    
    serverStatus.Monitor.status = /monitor/.test(raw);
    serverStatus.Dashboard.status = /dashboard/.test(raw);
    
})




//
//  Streaming
//

streamStatus = {
    'AccelerometerX': {
        status: false,
        simulator: 'x',
        hiccup: false
    },
    'AccelerometerY': {
        status: false,
        simulator: 'y',
        hiccup: false
    },
    'AccelerometerZ': {
        status: false,
        simulator: 'z',
        hiccup: false
    },
    'Humidity':{
        status: false,
        simulator: 'humidity',
        hiccup: false
    },
    'Temperature': {
        status: false,
        simulator: 'temperature',
        hiccup: false
    }
};

var v1 = new V1;

var socket = new Socket;

socket.connect(4900);



socket.tick(function (s) {
    
    for (key in streamStatus) {
        
        stream = streamStatus[key];
    
        if (stream.status) {
        
            var data = v1[stream.simulator]();
            
            
            if (stream.hiccup) {
                data.value = data.upperThreshold * 1.1 - data.lowerThreshold * 0.1;
                stream.hiccup = false;
            }
                
            s.write(data);
        }
        
    }
})

