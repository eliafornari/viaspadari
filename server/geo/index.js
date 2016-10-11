
let request = require('request');

exports.locate = function (req, res) {

  var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyC78_wz7i2ukhZryo0ya380QDkKZcylAP0'
  });



  var body = req.body;
  reverseGeocoding(body);





  function reverseGeocoding(data){
    var coord = [ data.lat, data.lng];
    console.log(coord);

    googleMapsClient.reverseGeocode({
      latlng: coord,
    }, function(err, response) {
      if (!err) {
        console.log(response.json);
        res.status(response.status).json(response.json);
        next();
      }
      console.log(response.status);
      res.status(response.status).json(err);

    })





    // // https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY

    // request({
    //     url: 'https://maps.googleapis.com/maps/api/geocode/json', //URL to hit
    //     method: 'POST',
    //     json: {
    //       "latlng": latlng,
    //       "key":"AIzaSyC78_wz7i2ukhZryo0ya380QDkKZcylAP0"
    //            } //Query string data
    //     }, function(error, response, body){
    //         if(error) {
    //             console.log("PUT entry error");
    //             console.log(error);
    //             // res.status(response.statusCode).json(body);
    //         } else {
    //             console.log("ok");
    //             console.log(body);
    //             // res.status(response.statusCode).json(body);
    //         }
    // });



      // const geolocation = require ('google-geolocation') ({
      //   key: 'AIzaSyC78_wz7i2ukhZryo0ya380QDkKZcylAP0'
      // });
      //
      // // Configure API parameters
      // const params = {
      //   wifiAccessPoints: [
      //     {
      //       macAddress: '01:23:45:67:89:AB',
      //       signalStrength: -65,
      //       signalToNoiseRatio: 40
      //     }
      //   ]
      // };
      //
      // // Get data
      // geolocation (params, (err, data) => {
      //   if (err) {
      //     console.log (err);
      //     return;
      //   }
      //
      //   console.log (data);
      //   reverseGeocoding(data)
      // });
  }
};
