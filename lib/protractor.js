var vm = require('vm');
var fs = require('fs');
var crypto = require('crypto');
var exec = require('child_process').exec;


var describes = [];

global.DartObject = function(o) { this.o = o };

global.describe = function(name, body) {
  describes.push({name: name, body: body, its: []});
};

global.it = function(name, body) {
  currentDescribe.its.push({name: name, body: body});
};

global.browser = {
  navigateTo: function(url) {
    console.log('Navigating to: ' + url);
  }
};

var dartFile = __dirname + '/my_spec.dart';
var dartSrc = fs.readFileSync(dartFile).toString();
var shasum = crypto.createHash('sha1');
shasum.update(dartSrc);
var fileSHA = shasum.digest('hex');
var dartJsFile = __dirname + '/my_spec.' + fileSHA + '.dart.js';
var src;
if (fs.existsSync(dartJsFile)) {
  runDart(fs.readFileSync(dartJsFile));
} else {
  exec('/Applications/dart/dart-sdk/bin/dart2js ' + dartFile + ' -o ' + dartJsFile,
      function(error, si, se) {
        if (error) {
          console.log(e, si, se);
        }
        runDart(fs.readFileSync(dartJsFile));
      }
  );
}

var currentDescribe = null;

function runDart(dartSrc) {
  vm.runInThisContext(dartSrc, dartJsFile);


  for(var i = 0; i < describes.length; i++) {
    currentDescribe = describes[i];
    currentDescribe.body();

    for(var j = 0; j < currentDescribe.its.length; j++) {
      var it = currentDescribe.its[j];
      it.body();
    }
  }
}

