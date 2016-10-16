"use strict"

let request = require('request');


//getting user location via GoogleMaps API
// exports.locate = function (req, res) {
//
//   var googleMapsClient = require('@google/maps').createClient({
//     key: 'AIzaSyC78_wz7i2ukhZryo0ya380QDkKZcylAP0'
//   });
//
//   var body = req.body;
//   reverseGeocoding(body);
//
//
// function loop(response){
//   for (var i in response.results[0].address_components){
//     for (var t in response.results[0].address_components[i].types){
//       if(response.results[0].address_components[i].types[t]=="country"){
//         var code = response.results[0].address_components[i].short_name;
//         moltin.Language.Set(code);
//         req.mySession.lang = code;
//         return code;
//       }
//     }
//   }
// }
//
//   function reverseGeocoding(data){
//     var coord = [ data.lat, data.lng];
//     googleMapsClient.reverseGeocode({
//       latlng: coord,
//     }, function(err, response) {
//       if (!err) {
//
//         res.status(response.status).json(loop(response.json));
//
//         next();
//       }
//       res.status(response.status).json(err);
//     })
//
//   }
// };






exports.set = function(req, res){
  var code = req.params.code;
  console.log(code);
  req.mySession.lang = code;
  res.status(200).json(code);

};
