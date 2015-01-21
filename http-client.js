const HOSTNAME = 'api.thethings.io'
    , API_VERSION = 'v1'
    , http = require('http')
    , events = require('events')
    , util = require('util')
    , PORT = 80


var Client = module.exports = function Client(config) {
    if (!(this instanceof Client)) {
        return new Client(config);
    }
    this.config = config;
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
        path: '/'+API_VERSION + '/ThingRead/' + this.config.THING_TOKEN + '/' + key,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'theThingsIO-Token: ' + this.config.USER_TOKEN
        }
    });
    var req = new Req(request);
    return req;
}

Client.prototype.thingReadLatest = function (key,parameters) {
//Read the last item stored by the thing
    var req = http.request({
        hostname: HOSTNAME,
        port: PORT,
        path: '/'+API_VERSION + '/ThingReadLatest/' + this.config.THING_TOKEN + '/' + key,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'theThingsIO-Token: ' + this.config.USER_TOKEN
        }
    });
    return new Req(req);
}

Client.prototype.thingWrite = function (object,parameters) {
    var request = http.request({
                hostname: HOSTNAME,
                port: PORT,
                path: '/'+API_VERSION + '/ThingWrite',
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'theThingsIO-Token: ' + this.config.USER_TOKEN
                }
            }
        )
        ;
    if (object === null || object === undefined) {
        throw 'Object to write not defined';
    }
    object.thing = {
        id: this.config.THING_TOKEN
    }
    var req = new Req(request, object);
    return req;
}
