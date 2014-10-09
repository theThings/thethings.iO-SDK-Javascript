var theThingsAPI = require('../');

var KEY = 'distance';

//create Client
var client = theThingsAPI.createClient();

//read latest write
var req1 = client.thingReadLatest(KEY);

//event fired when the response arrives
req1.on('response',function(res){
    console.log('Read Latest\n',res.statusCode, res.payload.toString(),'\n\n');
});
req1.end();

//read all writes in the last 30 days
var req2 = client.thingRead(KEY,{limit:10,startDate:'20141007T080001'});
req2.on('response',function(res){
    console.log('Read All\n',res.statusCode,res.payload.toString() ,'\n\n');
});
req2.end();

//The object to write.
var object = {
    "values":
        [
            {
                "key": KEY,
                "value": "100",
                "units": "m",
                "type": "temporal",
                "datetime" : "20141007080000"
            }
        ]
}
//write the object
var req3 = client.thingWrite(object);
req3.on('response',function(res){
    console.log('Write\n',res.statusCode,res.payload.toString() ,'\n\n');
});
req3.end();
