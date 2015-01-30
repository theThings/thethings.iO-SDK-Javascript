var theThingsAPI = require('../')

var client = theThingsAPI.createClient()

client.on('ready', function () {
    read(20150201000000)
})


function read(endDate) {
    console.log(endDate)
    client.thingRead('voltage', {limit: 3, endDate: endDate, startDate: '20150101000000'}, function (error, data) {
        console.log(error ? error : data)
        if (data.length > 0) {
            read(data[data.length - 1].datetime.split('.')[0].replace(/-/g, '').replace(/:/g, '').replace('T', ''))
        }
    })
}
