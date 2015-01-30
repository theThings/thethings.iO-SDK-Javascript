#theThings.IO node API lib
This lib allows to connect to the api.thethings.io endpoint.

Please visit the [documentation page](https://developers.thethings.io) page at [theThings.IO](https://thethings.io)


#Install
```
npm install thethingsio-api
```

##Getting started

Sign up to [thethings.iO](https://thethings.io) and create a user. Log in and go to the [things manager](https://panel.thethings.io/#/things-manager) and press "get activation codes".

You can put your activation code in a file called config.json with this format:

```js

{
    "activationCode" : "one of your activation codes"
}
```

If you already have your thing activated you can just put the thing token
```js

{
    "thingToken" : "one of your thing tokens"
}
```

With this package you can perform 4 types of actions:

  * thingRead: Reads the last values with a certain key.
  * thingWrite: Writes one or several values to the things.
  * thingSubscribe: Subscribes to the realtime channel of the thing.

If you provide an activation code your thing will be activated automatically when you create the client. Then the thing token will be saved to the same config.json.

Please, take a look at the source folder examples/ to see some code examples.


```js
var theThingsAPI = require('thethingsio-api');

var client = theThingsAPI.createClient();

var params = {limit:15}
client.on('ready', function () {
    client.thingRead('voltage', params, function (error, data) {
        console.log(error ? error : data)
    })
})
```
The previous code reads from the key 'voltage' the last 15 values. In the params object you can also add startDate and endDate in YYYYMMDDTHHmmss format. Note that the 'ready' event is fired when the activation is completed. If the thing is already activated the event will we fired after createClient()

