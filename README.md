#theThings.IO node API lib
This lib allows to connect to the api.theThings.IO endpoint.

Please visit the [documentation page](https://developers.thethings.io) page at [theThings.IO](https://thethings.io)


#Install
```
npm install thethingsio-api
```

##Getting started

You can put your credentials in a file called config.json with this format:

```js

{
    "USER_TOKEN" : "your user token",
    "THING_TOKEN" : "your thing token"
}
```

The following code creates a client reading the config from ./config.json and sends 3 requests to the theThings.IO
 coap endpoint. There are 3 possible requests

  * thingReadLatest Reads the last element written to the resource/thing.

  * thingRead Reads all the elements written to the resource in the last 30 days.

  * thingWrite Writes one or more elements to the resource

```js
var theThingsAPI = require('thethingsio-api');

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
```
