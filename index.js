var config = null;

function parseConfig(conf) {
    var config = {};
    if (conf.hasOwnProperty('USER_TOKEN')) {
        config.USER_TOKEN = conf.USER_TOKEN;
    } else {
        throw 'USER_TOKEN not defined';
    }
    if (conf.hasOwnProperty('THING_TOKEN')) {
        config.THING_TOKEN = conf.THING_TOKEN;
    } else {
        throw 'THING_TOKEN not defined';
    }
    return config;
}

function readFile(file) {
    var fs = require('fs');
    var data = fs.readFileSync(file, 'utf8')
    if (data === undefined) {
        throw 'Error: file ' + file + ' not found.';
    }
    return JSON.parse(data);
}

module.exports.createClient = function(protocol,file){
    if(protocol !== 'http' /*&& protocol !== 'coap'*/){
        protocol = 'http'
    }
    var config = {};
    if (file === undefined) {
        config = parseConfig(readFile(require('path').dirname(require.main.filename) + '/config.json'));
    } else if (typeof file === 'string') {
        config = parseConfig(readFile(file));
    } else {
        config = parseConfig(file);
    }

    var cli = /*protocol === 'http' ?*/ require('./http-client')(config) /*: require('./coap-client')(config)*/;
    return cli;
}