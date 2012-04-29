var io      = require('./server').io,
    Socket  = require('./socket').Socket,
    V1      = require('./v1').V1,
    net     = require('net');

io.set('log level', 0);

io.sockets.on('connection', function (socket) {

    socket.emit('init', streamStatus)

    socket.on('start', function (stream) {   
    
        streamStatus[stream].status = true;
    });
    
    socket.on('stop', function (stream) {
        streamStatus[stream].status = false;
    });
    
    socket.on('hiccup', function (stream) {
        streamStatus[stream].hiccup = true;
    });
    
});



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

socket.connect(4900, '61.222.87.71');



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

