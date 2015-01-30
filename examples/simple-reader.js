var theThingsAPI = require('../')

//create Client
var client = theThingsAPI.createClient()

client.on('ready', function () {
    client.thingRead('voltage', {limit: 15}, function (error, data) {
        console.log(error ? error : data)
    })
})