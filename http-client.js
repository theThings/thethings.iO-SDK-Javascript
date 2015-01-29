const HOSTNAME = 'api.thethings.io'
    , API_VERSION = 'v2'
    , http = require('http')
    , events = require('events')
    , util = require('util')
    , PORT = 80


var Client = module.exports = function Client(config) {
    if (!(this instanceof Client)) {
        return new Client(config)
    }
    events.EventEmitter.call(this)
    this.thingToken = config.thingToken
    this.activationCode = config.activationCode
    var that = this
    if (!this.thingToken && this.activationCode) {
        var activationRequest = this.activateThing(this.activationCode)
        activationRequest.on('data', function (data) {
            if (data.status === 'error') {
                that.emit('error', 'error activating thing')
            } else if (data.status === 'created') {
                that.emit('activated', data)
                that.thingToken = data.thingToken
                that.emit('ready')
            } else {
                that.emit('error', 'unknown activation response')
            }
        })
        activationRequest.end()
    }
    if (this.activationCode) {
        process.nextTick(function () {
            that.emit('ready')
        })
    }
}

function parametersToQuery(parameters) {
    var query = ''
    for (var param in parameters) {
        query += param + '=' + parameters[param] + '&'
    }
    return query.substring(0, query.length - 1)
}

function Req(request, object, callback) {
    if (callback === undefined) {
        callback = object
    }
    events.EventEmitter.call(this)
    this.request = request
    var that = this
    this.object = object
    request.on('response', function (res) {
        res.on('data', function (chunk) {
            chunk = JSON.parse(chunk)
            if (chunk === '{}') console.log('keepalive')
            that.emit('data', chunk)
            if (callback !== undefined) {
                callback(null, chunk)
            }
        })
    })

    request.on('error', function (error) {
        if (callback === undefined) {
            that.emit('error', error)
        } else {
            callback(error)
        }
    })

    this.end = function () {
        request.end(JSON.stringify(this.object))
    }
    if (callback !== undefined) {
        this.end()
    }
}

util.inherits(Req, events.EventEmitter)
util.inherits(Client, events.EventEmitter)

Client.prototype.activateThing = function (activatonCode, callback) {
    var request = http.request({
        hostname: HOSTNAME,
        port: PORT,
        path: '/' + API_VERSION + '/things',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    var req = new Req(request, {activationCode: activatonCode}, callback)
    return req
}

Client.prototype.thingRead = function (key, parameters, callback) {
    if (typeof parameters === 'function') {
        callback = parameters
    }
    if (typeof parameters !== 'object') {
        parameters = {}
    }
    var request = http.request({
        hostname: HOSTNAME,
        port: PORT,
        path: '/' + API_VERSION + '/things/' + this.thingToken + '/resources/' + key + '?' + parametersToQuery(parameters),
        headers: {
            'Accept': 'application/json'
        }
    })
    var req = new Req(request, callback)
    return req
}


Client.prototype.thingWrite = function (object, parameters, callback) {
    if (typeof parameters === 'function') {
        callback = parameters
    }
    if (typeof parameters !== 'object') {
        parameters = {}
    }
    var request = http.request({
            hostname: HOSTNAME,
            port: PORT,
            path: '/' + API_VERSION + '/things/' + this.thingToken + '?' + parametersToQuery(parameters),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    )

    if (object === null || object === undefined) {
        throw 'Object to write not defined'
    }

    var req = new Req(request, object, callback)
    return req
}

Client.prototype.thingSubscribe = function (parameters, callback) {
    if (typeof parameters === 'function') {
        callback = parameters
    }
    if (typeof parameters !== 'object') {
        parameters = {}
    }
    if (!parameters.keepAlive) {
        parameters.keepAlive = 60000//one min
    }
    var request = http.request({
            hostname: HOSTNAME,
            port: PORT,
            path: '/' + API_VERSION + '/things/' + this.thingToken + '?' + parametersToQuery(parameters),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    )

    var req = new Req(request, callback)
    return req
}