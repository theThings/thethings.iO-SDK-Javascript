var theThingsAPI = require('../');

var KEY = 'voltage';
var interval = 500;//ms

//create Client
var client = theThingsAPI.createClient();


//The object to write.
var object = {
    "values":
        [
            {
                "key": KEY,
                "value": "100",
                "units": "V",
                "type": "temporal"
            }
        ]
}
//write the object

setInterval(function(){
  object.values[0].value = Math.floor(Math.random()*100);
  var req3 = client.thingWrite(object);
  req3.on('response',function(res){
      console.log('Write\n',res.statusCode,res.payload.toString() ,'\n\n');
  });
  req3.end();
  console.log("send",object);
},interval);


