var theThingsAPI = require('../')

//create Client
var client = theThingsAPI.createClient()

client.on('error', function (error) {
    console.log('Error:', error)
})

client.on('ready', function () {
    client.thingSubscribe(function(error, data){
        console.log(error ? error : data)
    })
})
