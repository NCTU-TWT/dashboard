var net = require('net');


var Socket = function () {
    this.socket = new net.Socket;
};

Socket.prototype.connect = function (port, host) {
    
    var that = this;
    this.interval = 500;
    this.port = port || 4900;
    this.host = host || 'localhost';
    this.socket.connect(this.port, this.host);
    
    this.reconnect = function () {
        setTimeout(function () {
            console.log('reconnect in 3 secs');
            that.socket.connect(port, host);            
        }, 3000);
    };
    
    
    this.socket.on('connect', function () {    
        console.log('connection to ' + host + ':' + port + ' established'); 
    });    


    this.socket.on('error', function (err) {
        console.log(err);
        that.reconnect();
    });

    this.socket.on('end', function (err) {
        console.log('socket end');
        that.reconnect();
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
