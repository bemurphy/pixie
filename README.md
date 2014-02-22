# pixie

lightweight image pixel tracking using CouchDB

# example

``` js
var Pixie = require('pixie');

new Pixie({
  // A CouchDB/Cloudant url
  dbUrl: 'https://user:pass@app12345.heroku.cloudant.com',

  dbName: 'pixies',

  // How often to bulk write hit documents
  writeIntervalSeconds: 60,

  // A function that receives an expess req and returns a
  // custom object to be merged in with the hit doc
  extendDoc: function(req) {
    return {
      source: {
        uid: req.query.uid,
        build_id: req.query.build_id
      }
    };
  }
}).listen(process.env.PORT || 8080);
```

embed a tracking pixel in a webpage:

``` html
<img src="http://my-pixie-as123.herokuapp.com/pixie-example.gif?build_id=42&uid=971"
 width=0 height=0 style="display:none;margin:0;padding:0;" />
```

You'll end up with a hit doc in Cloudant that contains the `pixie` id (in this case 'example'),
the remote client ip, the referer, url, a numeric js timestamp, and your custom params:

``` json
{
  "_id": "16167b3721c5539a9373f4dd518f89ea",
  "_rev": "1-2d70255fd08d6479626f76ad724c49f3",
  "pixie": "example",
  "ip": "1.2.3.4",
  "url": "/pixie-example.gif?build_id=42&uid=971",
  "referer": "http://example.com/sales",
  "time": 1393101312716,
  "source": {
    "build_id": "42",
    "uid": "971"
  }
}
```
