var V1 = function () {
    
};

V1.prototype.x = function () {
    return  {
        name: "AccelerometerX",
        value: Math.sin(Date.now()/100)*4 + 50,
        unit: "",
        waveform: true,
        upperBound: 100,                                              
        lowerBound: 0,
        upperThreshold: 90,
        lowerThreshold: 10,
        reference: 50
    }
}

V1.prototype.y = function () {
    return  {
        name: "AccelerometerY",
        value: Math.sin(Date.now()/200)*8 + 50,
        unit: "",
        waveform: true,
        upperBound: 100,                                              
        lowerBound: 0,
        upperThreshold: 90,
        lowerThreshold: 10,
        reference: 50
    }
}


V1.prototype.z = function () {
    return  {
        name: "AccelerometerZ",
        value: Math.sin(Date.now()/300)*12 + 50,
        unit: "",
        waveform: true,
        upperBound: 100,                                              
        lowerBound: 0,
        upperThreshold: 90,
        lowerThreshold: 10,
        reference: 50
    }
}


V1.prototype.humidity = function () {
    return  {
        name: "Humidity",
        value: Math.sin(Date.now()/100000)*5 + 30,
        unit: "%",
        waveform: "false",
        upperThreshold: 90,
        lowerThreshold: 10,
    }
}

V1.prototype.temperature = function () {
    return  {
        name: "Temperature",
        value: Math.sin(Date.now()/100)*30 + 2000,
        unit: "°C",
        waveform: "false",
        upperThreshold: 9000,
        lowerThreshold: 1000,
    }
}


module.exports.V1 = V1;
