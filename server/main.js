"use strict"


let https = require("https");
let http = require("http");
let fs = require('fs');
let express = require("express");
let bodyParser = require('body-parser');
let routes  = require('./routes');
let geo  = require('./geo');
let user  = require('./user/user.js');
let path = require('path');
var util = require('util');
let ejs = require('ejs');
let request = require('request');
let sessions = require('client-sessions');
let satelize = require('satelize');
// var geoip = require('geoip-lite');
let app = express();









let moltin = require('moltin')({
  publicId: 'kmskXqQcPQCenV66qvxUXEFnrdxjHuKSMHFjHcLHcA',
  secretKey: '9thD7b3jm7pjiqj0cARkBpMXgeR0FdIPSx7qCjTyig'
});


app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
// app.use(function(req, res, next) {
//     if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
//         res.redirect('https://' + req.get('Host') + req.url);
//     }
//     else
//         next();
// });
app.use( express.static(__dirname + "/../client/assets/images") );
app.use(express.static('/../node_modules/jquery/dist/jquery.min.js'));
app.set('views', __dirname + '/../client');
app.use( express.static(__dirname + "/../client") );
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(sessions({
  cookieName: 'mySession', // cookie name dictates the key name added to the request object
  secret: 'blargadeeblargblarg', // should be a large unguessable string
  duration: 3600 * 1000, // how long the session will stay valid in ms
  activeDuration: 3600 * 1000 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

app.use(function(req, res, next) {

  if (req.mySession.access_token) {
    console.log(req.mySession);
    res.setHeader('X-Seen-You', 'true');
  } else {
    console.log(req.mySession);
    // setting a property will automatically cause a Set-Cookie response
    // to be sent
    res.setHeader('X-Seen-You', 'false');
  }

  if(req.mySession.lang){
    moltin.Language.Set(req.mySession.lang);
  }else{
    moltin.Language.Set("US");
  }
   next();
});




app.get('/profile', function(req, res){

     var img = fs.readFileSync('./client/assets/images/profile.jpg');
     res.writeHead(200, {'Content-Type': 'image/jpeg' });
     res.end(img, 'binary');

});

app.get('/authenticate', function(req, res){

  // Example retrieve IP from request
  // var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

  // then satelize call

  // Get client IP address from request object ----------------------
   function getClientAddress(req) {
          return (req.headers['x-forwarded-for'] || '').split(',')[0]
          || req.connection.remoteAddress;
  };

console.log(getClientAddress(req));
// ITA 217.29.167.157

// US 50.1.152.117
satelize.satelize({ip:"50.1.152.117"}, function(err, payload) {
  console.log(payload);
  req.mySession.lang = payload.country_code;

});



  moltin.Authenticate(function(data) {

    data.lang = req.mySession.lang
    console.log("it runs");
    if(data){
      if(req.mySession.access_token && (req.mySession.access_token==data.access_token)){
        console.log("1 runs");
        res.status(200).json(data);

      }else if(data.token){
        console.log("2 runs");
        console.log(data);
        res.status(200).json(data);

      }else{
        console.log("3 runs");
        req.mySession.access_token = data.access_token;
        res.status(200).json(data);

      }

    }else{
      res.status(500);
    }

  });
});








    function getUserCountry(req, res){
      var ip = req.ip;
      var ip = "207.97.227.239";
      var geo = geoip.lookup(ip);
    }


    app.post('/addProduct', function(req, res){
      var id = req.body.id.toString();
      var quantity = req.body.quantity;
      moltin.Cart.Insert(id, quantity, null, function(items){
        res.json(items);
      },function(err, doc){
        res.json(err);
      });
    });


    app.post('/addVariation', function(req, res){

      var variationArray = req.body
      for (var i in variationArray){
        var id = variationArray[i].id;
        var modifier = variationArray[i].modifier_id
        var variation = variationArray[i].variation_id
        var obj={};
        var objArray = [];
        obj[modifier] = variation
        objArray.push(obj);
        console.log(objArray);

      }


      // res.setHeader("Authorization", "Bearer "+token);

      moltin.Cart.Insert(id, 1, obj, function(cart) {
        console.log(cart);
        res.json(cart);
      }, function(error, response, c) {
        // Something went wrong...
        console.log(error);
        console.log(response);
        console.log(c);
        res.json(error);
      });

    });




    app.post('/removeProduct/:id', function(req, res){
      var id = req.params.id;
      console.log(id);

      moltin.Cart.Remove(id, function(items) {
          // Everything is awesome...
          console.log("all good");
          res.status(200);
          res.json(items);
      }, function(error, response, c) {
          // Something went wrong...
          console.log(response);
      });
    })

    app.get('/getProducts', function(req, res){
      getProduct(req, res);
    });

    app.get('/getCategories', function(req, res){
      getCategories(req, res);
    });

    app.get('/getCart', function(req, res){
      getCart(req, res);
    });

    app.post('/cartToOrder', function(req, res){
      var data = req.body;
      cartToOrder(req, res, data);
    });


    app.post('/orderToPayment', function(req, res){
      var order = req.body;
      orderToPayment(req, res, order);
    });

    app.post('/emptyCart', function(req, res){
      emptyCart(req, res);
    });

    app.post('/createUser', function(req, res){
      user.create(req, res);
    });

    app.post('/loginUser', function(req, res){
      user.login(req, res);
    });

    app.post('/setLang/:code', function(req, res){
      geo.set(req, res);
    });

    app.get('/user/:id/order', function(req, res){
      user.order(req, res);
    });

    // app.post('/locate', function(req, res){
    //   geo.locate(req, res);
    // });







//functions


    function emptyCart(req, res){

      moltin.Cart.Delete(function(data) {
        // Everything is awesome...
        res.status(200).json(data);
        console.log();
      }, function(error, response, c) {
        console.log("payment failed!");
        console.log("response: "+response);
        console.log("c: "+c);
        console.log("error: "+error);

        res.status(c).json(response);
        // Something went wrong...
      });

    }



    function getCart(req, res){
        moltin.Cart.Contents(function(items) {
          // res.writeHead(200, {'Content-Type': 'application/json'});
          res.json(items);
          // res.end(items);
            // Update the cart display
        }, function(error){
              console.log(error);
        });

    }


    var Product=[];
    function getProduct(req, res){
        moltin.Product.List(null, function(data) {
          Product = data;
          res.status(200).json(data);
        }, function(error) {
            // Something went wrong...
            res.status(400).json(error);
            console.log("Something went wrong in getting the products..");
        });
    }



    function getCategories(req, res){

      // moltin.Language.Set(req.mySession.lang);


      moltin.Category.Tree({}, function(tree) {
        res.status(200).json(tree);
      }, function(error) {
        console.log(error);
        res.status(400).json(error);
      });
    }




    function cartToOrder(req, res, data){

      var customer = data.customer;
      var ship_to = data.shipment;
      var bill_to = data.billing;
      var shipment_method = data.shipment_method;

        moltin.Cart.Complete({
          gateway: 'stripe',
          customer: {
            first_name: customer.first_name,
            last_name:  customer.last_name,
            email: customer.email
          },
          shipping: shipment_method,
          bill_to: {
            first_name: bill_to.first_name,
            last_name:  bill_to.last_name,
            address_1:  bill_to.address_1,
            address_2:  bill_to.address_2,
            city:       bill_to.city,
            county:     bill_to.county,
            country:    bill_to.country,
            postcode:   bill_to.postcode,
            phone:      bill_to.phone,
          },
          ship_to: {
            first_name: ship_to.first_name,
            last_name:  ship_to.last_name,
            address_1:  ship_to.address_1,
            address_2:  ship_to.address_2,
            city:       ship_to.city,
            county:     ship_to.county,
            country:    ship_to.country,
            postcode:   ship_to.postcode,
            phone:      ship_to.phone,
          }
        }, function(order) {

          res.json(order);
            // Handle the order

        }, function(error, response, c) {
          console.log(response);
          res.json(error);
          // Something went wrong...
        });


    }




    function orderToPayment(req, res, order){
      var card_number = order.number.toString();
      var expiry_month = order.expiry_month;
      var expiry_year = order.expiry_year;
      var cvv = order.cvv;
      var obj={};
      obj = {
                data: {
                number: card_number,
                expiry_month: expiry_month,
                expiry_year: expiry_year,
                cvv: cvv
              }
            }
      moltin.Checkout.Payment('purchase', order.id, obj, function(payment, error, status) {

          console.log("payment successful");
          console.log(payment);
          res.status(200).json(payment);

      }, function(error, response, c) {
        console.log("payment failed!");
        console.log("response: "+response);
        console.log("c: "+c);
        console.log("error: "+error);

        res.status(c).json(response);
        // Something went wrong...
      })
    }




    app.post('/updatestock', function(req, res){
      searchProduct(req, res);
    });


    function searchProduct(req, res){
      var contents = req.body.contents;
      console.log("updateOverallStockFN");
      console.log(contents);

        for (var i in contents){
          for(var m in contents[i].modifiers){
            var modifier_id = contents[i].modifiers[m].id;
            for (var p in Product){
              for(var v in Product[p].modifiers){
                console.log('modifier_id: '+modifier_id);
                console.log('this one: '+Product[p].modifiers[v].id);
                if(modifier_id == Product[p].modifiers[v].id){

                  var thisProduct = Product[p].id;
                  var quantity = contents[i].quantity;
                  var stock = Product[p].stock_level - contents[i].quantity;
                  console.log('thisProduct: '+thisProduct);
                  updateProductStock(thisProduct, stock);
                }
              }
            }
          }
        }//for loop
    }




    function updateProductStock(id, stock){

      console.log("newStock: "+stock);

      moltin.Product.Update(id, {
          stock_level:  stock
      }, function(product) {

          console.log(product);
          console.log("overall stock update successful");
          res.status(200).json(product);

      }, function(error, response, c) {
        console.log("payment failed!");
        console.log("response: "+response);
        console.log("c: "+c);
        console.log("error: "+error);
        res.status(c).json(response);
          // Something went wrong...
      });

    }





    function eraseAllOrders(){

      moltin.Order.List(null, function(order) {
          // console.log(order);
          for (var i in order){
            var id = order[i].id;
            id = id.toString();
            moltin.Order.Delete(id, function(data) {
                // Success
            }, function(error) {
                // Something went wrong...
            });

          }
      }, function(error) {
          // Something went wrong...
      });
    }






app.get('/data', function(req, res){
  // Get content from file
 var countries = fs.readFileSync("data/countries.json");
 var locale = fs.readFileSync("data/locale.json");

 var countries = JSON.parse(countries);
 var locale = JSON.parse(locale);


 var data= {};
 data.countries = countries;
 data.locale = locale;

 res.json(data);
});















    app.get('/robots.txt', routes.robots);

    app.get('*', routes.index);

    app.listen(8081, () => console.log("listening on 8081"));

    // https.createServer(options, app).listen(80);
    // http.createServer(app).listen(9000);







    // // set up plain http server
    // var http = express.createServer();
    //
    // // set up a route to redirect http to https
    // http.get('*',function(req,res){
    //     res.redirect('https://mydomain.com'+req.url)
    // })
    //
    // // have it listen on 8080
    // http.listen(8080);
