const HOSTNAME = 'api.devices.thethings.io'
    , API_VERSION = 'v2'
    , events = require('events')
    , util = require('util')
var http = null


var Client = module.exports = function Client(config,secure) {
    if (!(this instanceof Client)) {
        return new Client(config,secure)
    }
    http = secure ? require('https') : require('http')
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
    if (this.thingToken) {
        setImmediate(function () {//maybe a process.nextTick would be better
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
    if (callback === undefined && typeof object === 'function') {
        callback = object
    }
    var that = this
    events.EventEmitter.call(this)
    this.request = request
    this.object = object
    this.timeout = null

    this._restartTimeout = function (time) {
        if (that.timeout) {
            clearTimeout(this.timeout)
        }
        that.timeout = setTimeout(function () {
            that.emit('disconected')
        }, time + 1000)
        return that.timeout
    }

    if (request.keepAlive) {
        that._restartTimeout(request.keepAlive)
    }
    request.on('response', function (res) {
        res.on('data', function (chunk) {
            if (request.keepAlive) {
                that._restartTimeout(request.keepAlive)
                if (chunk.toString() === '{}') {
                    that.emit('keepAlive')
                    return
                }
                chunk = JSON.parse(chunk)
                if (chunk.status === 'success' && chunk.message === 'subscribed') {
                    that.emit('subscribed')
                    return
                } else if (chunk.status === 'error') {
                    if (callback !== undefined) {
                        return callback(chunk.message)
                    } else {
                        that.emit('error', chunk.message)
                    }
                }
            } else {
                chunk = JSON.parse(chunk)
            }
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
            path: '/' + API_VERSION + '/things/' + this.thingToken + '?' + parametersToQuery(parameters),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    )
    request.keepAlive = parameters.keepAlive

    var req = new Req(request, callback)
    return req
}
