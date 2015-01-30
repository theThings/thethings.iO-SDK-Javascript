var theThingsAPI = require('../')

var client = theThingsAPI.createClient()

client.on('error', function (error) {
    console.log('Error:', error)
})

var startTime = null

client.on('ready', function () {
    var subscription = client.thingSubscribe(function (error, data) {
        if (error) {
            console.error('problems with the subscription:', error)
            process.exit()
        } else {
            var endTime = new Date().getTime()
            console.log('There is a lag of ', endTime - startTime, 'ms in the realtime environment of thethings.iO')
            process.exit()
        }
    })

    subscription.on('subscribed', function () {
        startTime = new Date().getTime()
        client.thingWrite({values: [
            {key: 'hello', value: 'world'}
        ]}, function (error, data) {
            if (error) {
                console.error('problems writing:', error)
            }
        })
    })
})
