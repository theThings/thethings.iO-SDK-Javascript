var config = null
    , fs = require('fs');


function parseConfig(conf) {
    var config = conf;
    if (typeof conf !== 'object') {
        throw 'Invalid config file format'
    }
    if (!conf.thingToken && !conf.activationCode) {
        throw 'The config file has not thingToken nor activationCode'
    }
    return config;
}

function readFile(file) {
    var data = fs.readFileSync(file, 'utf8')
    if (data === undefined) {
        throw 'Error: file ' + file + ' not found.';
    }
    return JSON.parse(data);
}

function writeFile(file, data) {
    fs.writeFile(file, JSON.stringify(data), function (err) {
        if (err) {
            throw ('Error saving config')
        }
    });
}

function createClient(file,secure){
    var config = {};
    var filename = null
    if (file === undefined) {
        filename = require('path').dirname(require.main.filename) + '/config.json'
        config = parseConfig(readFile(filename))
    } else if (typeof file === 'string') {
        filename = file
        config = parseConfig(readFile(file))
    } else {
        config = parseConfig(file)
    }
    var cli = /*protocol === 'http' ?*/ require('./http-client')(config, secure) /*: require('./coap-client')(config)*/;
    cli.on('activated', function (data) {
        if (filename) {
            var newData = config
            newData.thingToken = data.thingToken
            writeFile(filename, newData)
        }
    })
    return cli;
}

module.exports.createSecureClient = function(file){
  return createClient(file, true)
}

module.exports.createClient = function (file) {
  return createClient(file,false)
}


