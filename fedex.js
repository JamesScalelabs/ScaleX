var fedexAPI = require('fedex');
var util = require('util');
var fs = require('fs');


var fedex = new fedexAPI({
  environment: 'sandbox', // or live
  debug: true,
  key: '6z7g0eXTnENrjR8Q',
  password: 'MQOePNUT5v7hNR79FwDYADXiB',
  account_number: '604501202',
  meter_number: '119009361',
  imperial: true // set to false for metric
});



fedex.track({
  SelectionDetails: {
    PackageIdentifier: {
      Type: 'TRACKING_NUMBER_OR_DOORTAG',
      Value: '123456789012'
    }
  }
}, function(err, res) {
  if(err) {
    return console.log(err);
  }

    console.log("Response %j", res);

});
