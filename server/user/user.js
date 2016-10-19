"use strict"

let request = require('request');
let nodemailer = require('nodemailer');
let crypto = require('crypto');
let fs = require('fs');
// var xoauth2 = require('xoauth2');

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

  // curl -X PUT https://api.molt.in/v1/customers/:id \
  // 	-H "Authorization: Bearer XXXX" \
  // 	-d "group=<GROUP ID>"
  // 	-d "group=1061078393216303747" \
  // 	-d "password=supersecret"



  var body = req.body;
  console.log(body);

  request({
      url: 'https://api.molt.in/v1/customers/'+body.token, //URL to hit
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer '+req.mySession.access_token,
        "customer_token":body.token
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

  var html = fs.readFileSync("data/reset-password.html");


  crypto.randomBytes(48, function(err, buffer) {
    body.token = buffer.toString('hex');
    console.log('token', body.token);
    req.mySession.user_temp_token=body.token;
    sendEmail();
  });


  var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'service@viaspadari.com',
        pass: 'Nina2Simone7'
    }
  };



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

  request({
      url: 'https://api.molt.in/v1/customers/'+req.mySession.access_token, //URL to hit
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer '+req.mySession.access_token
      },
      json: {
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
