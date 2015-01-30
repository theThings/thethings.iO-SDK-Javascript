var theThingsAPI = require('../')

//create Client
var client = theThingsAPI.createClient()

//This is usually fired when there are problems with the activation code
client.on('error', function (error) {
    console.log('Error:', error)
})


client.on('ready', function () {
    //keepAlive is optional, default to 60000 (60s)
    var request = client.thingSubscribe({keepAlive:10000},function(error, data){
        if(error){
          console.error(error)
          process.exit()
        }else{
          console.log(data)
        }
    })
    
    request.on('subscribed',function(){
      console.log('Subscribed successfully')
    })
    
    request.on('keepAlive',function(){
      console.log('Got keepAlive')
    })
    
    //Fired when you don't recieve keepAlives anymore
    //You should try to reconnect at this point (maybe the wifi is down?)
    request.on('disconected', function(){
      console.log('Disconected, exiting...')
      process.exit()
    })
})


