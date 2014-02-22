var _ = require('underscore');
var express = require('express');
var app = express();
var nano = require('nano');

// 1px transparent gif
var b64string = 'R0lGODlhAQABAAAAACw=';
var imageBuf = new Buffer(b64string, 'base64');

module.exports = function(config) {
  var extendDoc = config.extendDoc;
  var bulkWriteIntervalSeconds = config.writeIntervalSeconds || 60;

  var dbUrl = config.dbUrl || process.env.CLOUDANT_URL;

  var db = nano(dbUrl + '/' + config.dbName);

  var hits = [];

  app.get('/pixie-([a-zA-Z0-9]+).gif', function(req, res){
    var referer = req.get('Referer');

    var hit = {
      pixie: req.params[0],
      ip: req.ip,
      url: req.url,
      referer: referer,
      time: new Date().getTime()
    };

    if (extendDoc) hit = _.extend(hit, extendDoc(req));

    console.log('pixie-tracked:', JSON.stringify(hit));
    hits.push(hit);

    res.type('gif');
    res.send(imageBuf);
  });

  var bulkWrite = function() {
    if (hits.length === 0) return;

    var bulk = hits.splice(0, hits.length);

    db.bulk({docs: bulk}, function(err, docs){
      if (err) {
        console.log(err);
        hits = hits.concat(bulk);
      } else {
        console.log('Wrote', bulk.length, "docs to storage");
      }
    });
  };

  return {
    listen: function(port, callback) {

      app.listen(port, function(){
        console.log('Pixie listening on port', port);
        if (callback) callback();
      });

      setInterval(bulkWrite, bulkWriteIntervalSeconds * 1000);

    }
  };
};
