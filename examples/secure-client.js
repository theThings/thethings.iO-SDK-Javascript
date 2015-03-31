var theThingsAPI = require('../')

//create Client
var client = theThingsAPI.createSecureClient()

client.on('error',function(err){
  console.log('error',err)
})

client.on('ready', function () {
    client.thingRead('voltage', {limit: 15}, function (error, data) {
        console.log(error ? error : data)
    })
})
