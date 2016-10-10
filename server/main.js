"use strict"


let https = require("https");
let http = require("http");
let fs = require('fs');
let express = require("express");
let bodyParser = require('body-parser');
let routes  = require('./routes');
let path = require('path');
var util = require('util');
let ejs = require('ejs');
let request = require('request');
// var geoip = require('geoip-lite');
let app = express();




// { range: [ 3479299040, 3479299071 ],
//   country: 'US',
//   region: 'CA',
//   city: 'San Francisco',
//   ll: [37.7484, -122.4156] }


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
var token;



app.get('/profile', function(req, res){

     var img = fs.readFileSync('./client/assets/images/profile.jpg');
     res.writeHead(200, {'Content-Type': 'image/jpeg' });
     res.end(img, 'binary');

});

app.get('/authenticate', function(req, res){

  // var ip = req.ip;
  // var ip = "207.97.227.239";
  // var geo = geoip.lookup(ip);

  moltin.Authenticate(function(data) {
    console.log(data);
    // data.geo = geo;
    if(data){
      token = data.access_token;
      res.status(200);
      res.json(data);
    }else{
      res.status(500);
    }

  });
});




    function getUserCountry(req, res){
      var ip = req.ip;
      var ip = "207.97.227.239";
      var geo = geoip.lookup(ip);

      console.log(geo);
    }


    app.post('/addProduct', function(req, res){

      var id = req.body.id.toString();
      var quantity = req.body.quantity;
      console.log(id);
      // var token = req.body.access_token;
      // console.log();
      // res.setHeader("Authorization", "Bearer "+token);

      moltin.Cart.Insert(id, quantity, null, function(items){
          console.log(items);
        res.json(items);

      },function(err, doc){
        console.log(err, doc);
        res.json(err);
      });

    });


    app.post('/addVariation', function(req, res){

      console.log('request =' + JSON.stringify(req.body))

      var variationArray = req.body
      for (var i in variationArray){
        var id = variationArray[i].id;
        var modifier = variationArray[i].modifier_id
        var variation = variationArray[i].variation_id
        // console.log('variationArray[i]: '+variationArray[i]);
        // console.log('id: '+id);
        // console.log('modifier: '+variationArray[i].modifier_id);
        // console.log('variation: '+variationArray[i].variation_id);
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
        console.log(error);
        console.log(response);
        console.log(c);
        res.json(error);
          // Something went wrong...
      });

    });




    app.post('/removeProduct', function(req, res){
      console.log(req);

      var id = req.body.id;
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
      createUser(req, res);
    });

    app.post('/loginUser', function(req, res){
      loginUser(req, res);
    });








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
          console.log(data);
          Product = data;
          res.status(200).json(data);

        }, function(error) {
            // Something went wrong...
            res.status(400).json(error);
            console.log("Something went wrong in getting the products..");
        });
    }



    function getCategories(req, res){
      // moltin.Category.List(null, function(category) {
      //     console.log(category);
      //     res.status(200).json(category);
      // }, function(error) {
      //   console.log(error);
      //   res.status(400).json(error);
      //     // Something went wrong...
      // });


      moltin.Category.Tree({}, function(tree) {
        console.log(tree);
        res.status(200).json(tree);
      }, function(error) {
        console.log(error);
        res.status(400).json(error);
      });
    }




    function cartToOrder(req, res, data){
      console.log("wait for the order");
      console.log(data);

      var customer = data.customer;
      console.log('customer:',customer);
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

          console.log("wait for the order");
          console.log(order);

          res.json(order);
            // Handle the order

        }, function(error, response, c) {
          console.log(response);
          res.json(error);
          // Something went wrong...
        });


    }




    function orderToPayment(req, res, order){
      console.log(order);
      var card_number = order.number.toString();
      console.log(card_number);
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

            console.log(id);

            moltin.Order.Delete(id, function(data) {

              console.log(data);
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














function createUser(req, res){

  var body = req.body;

  console.log(body);

  //create customer
  moltin.Customer.Create({
      first_name:  body.first_name,
      last_name:  body.last_name,
      email: body.email,
      password: body.password,
      country: body.country
  }, function(customer) {
    console.log("customer");
      console.log(customer);
      res.json(c);
  }, function(error, response, c) {
    console.log(error);
    console.log(response);
    console.log(c);
    res.status(c).json(response);
      // Something went wrong...
  });


}



function loginUser(req, res){

  var body = req.body;
  console.log(body);

  request({
      url: 'https://api.molt.in/v1/customers/token', //URL to hit
      method: 'POST',
      headers: {
        'Authorization': 'Bearer '+token
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

}

















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
