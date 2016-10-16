
let request = require('request');

exports.login = function (req, res) {

        var body = req.body;
        console.log(body);
        console.log(req.mySession.access_token);

        request({
            url: 'https://api.molt.in/v1/customers/token', //URL to hit
            method: 'POST',
            headers: {
              'Authorization': 'Bearer '+req.mySession.access_token
            },
            json: {
              "email": body.email,
              "password": body.password
                   } //Query string data
            }, function(error, response, body){
                if(error) {
                    console.log("PUT entry error");
                    console.log(error);
                    res.status(response.statusCode).json(body);
                } else {
                    console.log("ok");
                    console.log(body);
                    res.status(response.statusCode).json(body);
                }
        });
};




exports.create = function (req, res){

  // var body = req.body;
  // console.log(body);

  // //create customer
  // moltin.Customer.Create({
  //     first_name:  body.first_name,
  //     last_name:  body.last_name,
  //     email: body.email,
  //     password: body.password,
  //     country: body.country
  // }, function(customer) {
  //   console.log("customer");
  //     console.log(customer);
  //     res.json(c);
  // }, function(error, response, c) {
  //   console.log(error);
  //   console.log(response);
  //   console.log(c);
  //   res.status(c).json(response);
  //     // Something went wrong...
  // });



  var body = req.body;
  console.log(body);

  request({
      url: 'https://api.molt.in/v1/customers', //URL to hit
      method: 'POST',
      headers: {
        'Authorization': 'Bearer '+req.mySession.access_token
      },
      json: {
        "first_name":  body.first_name,
        "last_name":  body.last_name,
        "email": body.email,
        "password": body.password,
        "country": body.country
             } //Query string data
      }, function(error, response, body){
          if(error) {
              console.log("PUT entry error");
              console.log(error);
              res.status(response.statusCode).json(body);
          } else {
              console.log("ok");
              console.log(body);
              res.status(response.statusCode).json(body);
          }
  });

};









exports.order = function(req, res){

  var id = req.params.id.toString();
  console.log(req.params.id);



  // moltin.Order.Find({"customer": id}, function(order) {
  //   console.log(order);
  //   res.status(200).json(order);
  // }, function(error, response, c) {
  //   console.log(error,c, response);
  //   res.status(400).json(error);
  //     // Something went wrong...
  // });
  //
  // curl -X GET https://api.molt.in/v1/orders/search \
  //   -H "Authorization: Bearer XXXX" \
  //   -d "customer=1055961503028478872"

  request({
      url: 'https://api.molt.in/v1/orders/search?customer=1357820567859757087', //URL to hit
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+req.mySession.access_token
      }
      }, function(error, response, body){

          if(error) {
              console.log("PUT entry error");
              console.log(error);
              res.status(response.statusCode).json(body);
          } else {
              console.log("ok");
              console.log(body);
              res.status(response.statusCode).json(body);
          }
  });

};

// curl -X GET https://api.molt.in/v1/orders/search \
//   -H "Authorization: Bearer 61f3e683ad89ef40fd481c153372f56bc42a28cf" \
//   -d "customer=1357820567859757087"
