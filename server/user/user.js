"use strict"

let request = require('request');
let nodemailer = require('nodemailer');
let crypto = require('crypto');
let fs = require('fs');
// var xoauth2 = require('xoauth2');

let moltin = require('moltin')({
  publicId: 'kmskXqQcPQCenV66qvxUXEFnrdxjHuKSMHFjHcLHcA',
  secretKey: '9thD7b3jm7pjiqj0cARkBpMXgeR0FdIPSx7qCjTyig'
});

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




exports.create = function(req, res){


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




//EDIT USER
exports.edit = function(req, res){


  var body = req.body;
  if(body.token){
    req.mySession.user_token = body.token;
  }

  console.log(body);

  request({
      url: 'https://api.molt.in/v1/customers/'+req.mySession.user_token, //URL to hit
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer '+req.mySession.access_token,
        "customer_token":body.token
      },
      json: {
        "first_name":  body.first_name,
        "last_name":  body.last_name,
        "email": body.email,
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
      url: 'https://api.molt.in/v1/orders?customer='+id, //URL to hit
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
              var data = JSON.parse(body);
              res.status(response.statusCode).json(data);
          }
  });

};






exports.resetPassword = function (req, res) {
  var body = req.body;







  //STEP 1     GET USER ID AND TOKEN

var getId = ()=>{

  var email = body.email.toString();
  console.log('email:',email);
  console.log('access_token:',req.mySession.access_token);
  //authenticate user to get him a token
  request({
      url: 'https://api.molt.in/v1/customers/search?email=dev@eliafornari.com', //URL to hit
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+req.mySession.access_token
      }
    }, function(error, response, response_body){
          if(error) {
              console.log("PUT entry error");
              console.log(error);

          } else {
              console.log("ok");
              console.log(response_body);
              response_body = JSON.parse(response_body);
              req.mySession.user_id = response_body.result[0].id;
              console.log('req.mySession.user_id',req.mySession.user_id);
              // getToken();
              generateCrypto();

          }
  });
}

getId();


var getToken = ()=>{
  //authenticate user to get him a token
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

          } else {
              console.log("ok");
              console.log(body);
              generateCrypto();

          }
  });

}






//STEP 2     GENERATE CRYPTO TOKEN
var html = fs.readFileSync("data/reset-password.html");
var smtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
      user: 'service@viaspadari.com',
      pass: 'Nina2Simone7'
  }
};


var generateCrypto=()=>{



  crypto.randomBytes(48, function(err, buffer) {
    body.token = buffer.toString('hex');
    console.log('token', body.token);
    req.mySession.user_temp_token=body.token;
    sendEmail();
  });



}







//STEP 3     SEND EMAIL

  var sendEmail = ()=>{

      var transporter = nodemailer.createTransport(smtpConfig);

      // create template based sender function
      var sendPwdReset = transporter.templateSender({
          subject: 'Password reset for {{username}}!',
          text: 'Hello, {{username}}, Please go here to reset your password: {{ reset }}',
          html: html,
          messageId: body.token

      }, {
          from: 'sender@example.com',
      });


    console.log('http://localhost:8081/user/'+body.email+'/reset/?token='+body.token);
    // use template based sender to send a message
    sendPwdReset({
        to: 'dev@eliafornari.com'
    }, {
        username: body.email,
        reset: 'http://localhost:8081/user/'+body.email+'/reset/?token='+body.token
    }, function(err, info){
        if(err){
            console.log('Error');
            console.log(err, info);
            res.status(400).json(err);
        }else{
            console.log('Password reset sent');

            res.status(200).json(info);
        }
    });
  }

};//resetPassword email


exports.newPassword = function(req, res){

  var body = req.body;
  var password = body.password.toString();
  console.log('new password: '+body.password);
  moltin.Authenticate(function(data) {

        moltin.Customer.Update(req.mySession.user_id, {
          'password':body.password
      }, function(customer) {
          console.log(customer);
          res.status(200).json(customer);
      }, function(error, response, c) {
        console.log(error, response, c);
        res.status(400).json(body);
          // Something went wrong...
      });
  });

  //
  // request({
  //     url: 'https://api.molt.in/v1/customers/'+req.mySession.token, //URL to hit
  //     method: 'PUT',
  //     headers: {
  //       'Authorization': 'Bearer '+req.mySession.access_token
  //     },
  //     json: {
  //       "password": body.password
  //            } //Query string data
  //     }, function(error, response, body){
  //         if(error) {
  //             console.log("PUT entry error");
  //             console.log(error);
  //             res.status(response.statusCode).json(body);
  //         } else {
  //             console.log("ok");
  //             console.log(body);
  //             res.status(response.statusCode).json(body);
  //         }
  // });

  };

//
//   I have an issue. I built a reset password email system in Node but I have no idea how to change a customers password in Moltin.
//   My problem is that to do a Put request to edit a customer I need a customer token:   curl -X PUT https://api.molt.in/v1/customers/:id \ I don't know why but that :id parameter is the customer token for moltin.
// Anyway to get that token I need to auth the customer in and to auth the customer in I need the password, which is what I was trying to change in the first place. By the way if I call a customer info it does not return his password. it return password true.
// There has to be a better was to act as an admin user and get that token/password change the password. Please no JS SDK I am using pure node requests.
