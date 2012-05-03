var net = require('net');


var Socket = function () {
    this.socket = new net.Socket;
};

Socket.prototype.connect = function (port, host) {
    
    var that = this;
    this.interval = 500;
    this.port = port || 4900;
    this.host = host || 'localhost';
    
    // create connection    
    connect = function connect () {    
        that.socket.connect(that.port, that.host);
                
        
        
    };
    
    connect();
        
    that.socket.on('connect', function () {            
        
            console.log('connection to ' + host + ':' + port + ' established'); 
            
        }).on('close', function () {
        
            console.log('connection closed')
            setTimeout(connect, 1000);
            
        }).on('error', function (err) {
    
            if (err.code === 'ECONNREFUSED') {
                console.log('retry')
                //setTimeout(connect, 1000);
            }
        });

};


Socket.prototype.write = function (data) {    
    if (this.socket.writable) {
        this.socket.write(JSON.stringify(data));
    }    
};

Socket.prototype.init = function (callback) {    
    if (callback)
        callback(this);
};

Socket.prototype.tick = function (callback) {
    var that = this; 
    setInterval(function () {   
        if (callback)          
            callback(that);
    }, this.interval);
};

module.exports.Socket = Socket;
