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
