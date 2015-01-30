var theThingsAPI = require('../')

//create Client
var client = theThingsAPI.createClient()

//The object to write.
var object = {
    "values": [
        {
            "key": 'voltage',
            "value": "100"
        }
    ]
}

client.on('ready', function () {
//write the object
    setInterval(function () {
        object.values[0].value = Math.floor(Math.random() * 100)
        client.thingWrite(object, function (error, data) {
            console.log(error ? error : data)
        })
        console.log("send", object)
    }, 1000)
})
