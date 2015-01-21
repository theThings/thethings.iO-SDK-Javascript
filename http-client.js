const HOSTNAME = 'api.thethings.io'
    , API_VERSION = 'v2'
    , http = require('http')
    , events = require('events')
    , util = require('util')
    , PORT = 80


var Client = module.exports = function Client(thingToken) {
    if (!(this instanceof Client)) {
        return new Client(config);
    }
    this.thingToken = thingToken;
}

function parametersToQuery(parameters){
    var query = ''
    for(var param in parameters){
        query += param+'='+parameters+'&'
    }
    return query.substring(0,query.length-1)
}

function Req(request, object) {
    events.EventEmitter.call(this);
    this.request = request;
    var that = this;
    this.object = object;
    request.on('response', function (res) {
        res.on('data', function (chunk) {
            res.payload = chunk;
            that.emit('response', res);
        })
    })

    request.on('error',function(error){
        that.emit('error',error)
    })

    this.end = function () {
        request.end(JSON.stringify(this.object));
    }
}

util.inherits(Req, events.EventEmitter);

Client.prototype.thingRead = function (key,parameters) {
    var request = http.request({
        hostname: HOSTNAME,
        port: PORT,
        path: '/'+API_VERSION + '/things/' + this.thingToken + '/resources' + key + '?' + parametersToQuery(parameters) ,
        headers: {
            'Accept': 'application/json'
        }
    });
    var req = new Req(request);
    return req;
}


Client.prototype.thingWrite = function (object,parameters) {
    var request = http.request({
                hostname: HOSTNAME,
                port: PORT,
                path: '/'+API_VERSION + '/things/'+ this.thingToken +  '?' + parametersToQuery(parameters),
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
        ;
    if (object === null || object === undefined) {
        throw 'Object to write not defined';
    }

    var req = new Req(request, object);
    return req;
}

Client.prototype.subscribe = function(parameters){
    var request = http.request({
                hostname: HOSTNAME,
                port: PORT,
                path: '/'+API_VERSION + '/things/'+ this.thingToken +  '?' + parametersToQuery(parameters),
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
        ;
    var req = new Req(request);
    return req;
}