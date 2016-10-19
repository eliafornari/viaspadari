'use strict'

import 'angular'
import 'angular-route'
import 'angular-animate'
import 'angular-resource'
import Prismic from 'prismic.io'
import jQuery from "jquery"

angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'ngAnimate',
  'infinite-scroll'
])







.run(['$anchorScroll', '$route', '$rootScope', '$location', '$routeParams','$templateCache', function($anchorScroll, $route, $rootScope, $location, $routeParams, $templateCache) {

$rootScope.pageLoading = true;

$rootScope.Coordinates;





//a change of path should not reload the page
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        else if (reload === true){
            var currentPageTemplate = $route.current.templateUrl;
            $templateCache.remove(currentPageTemplate);
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                  $route.current = '/';
                  un();
                  $route.reload();
              });
        }
        return original.apply($location, [path]);
    };

  }])



  .filter('trustUrl', function ($sce) {
      return function(url) {

        newurl = url+"?rel=0&amp;controls=0&amp;showinfo=0"
        // if (url){
          var trusted = $sce.trustAsResourceUrl(newurl);
          return trusted;
        // }
      };
    })



  .filter('productFilter', function ($sce, $routeParams, $rootScope) {
      return function(data) {
        var category = $routeParams.category;
        var filtered = [];
        // console.log('category: '+category);
        for (var i in $rootScope.Product){
          for (var c in $rootScope.Product[i].category.data){
            if($rootScope.Product[i].category.data[c].slug == category){
              filtered = filtered.concat($rootScope.Product[i]);
              // console.log(filtered);
            }

            if($rootScope.Product[i].category.data[c].parent != null){
              $rootScope.Product[i].category.child =$rootScope.Product[i].category.data[c].slug
            }
          }

        }
        return filtered;
      };
    })


.config(['$routeProvider', '$locationProvider' ,'$sceProvider', function($routeProvider, $locationProvider, $sceProvider) {

$sceProvider.enabled(false);

  // use the HTML5 History API
  $locationProvider.html5Mode(true);

  $routeProvider


    // $locationChangeStart
    .when('/philosophy', {
      templateUrl: 'views/philosophy.html'
    })

    .when('/terms-services', {
      templateUrl: 'views/terms.html'
    })

    .when('/register', {
      templateUrl: 'views/user/register.html'
    })

    .when('/login', {
      templateUrl: 'views/user/login.html'
    })

    .when('/user/:useremail/reset/', {
      templateUrl: 'views/user/new-password.html'
    })

    .when('/user/reset', {
      templateUrl: 'views/user/reset-password.html'
    })

    .when('/account', {
      templateUrl: 'views/user/account.html'
    })

    .when('/about', {
      templateUrl: 'views/about.html'
    })

    .when('/contact', {
      templateUrl: 'views/contact.html'
    })


    .when('/:category/:detail', {
      templateUrl: 'views/detail.html',
      controller: 'detailCtrl'
      // reloadOnSearch: false
    })

    .when('/:category', {
      templateUrl: 'views/product.html',
      controller: 'productCtrl'
      // reloadOnSearch: false
    })


    .when('/privacy', {
      templateUrl: 'privacy/privacy.html',
      controller: 'privacyCtrl'
    })


    .when('/client/assets/images/profile.jpg', {

    }

)

    /*............................. Take-all routing ........................*/


    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'homeCtrl',
      resolve: {

        }

    })


    // put your least specific route at the bottom
    .otherwise({redirectTo: '/'})






}])

.controller('appCtrl', function($scope, $location, $rootScope, $routeParams, $timeout, $interval, $window, $http, transformRequestAsFormPost, $route){


//setting variables and objects
$rootScope.location = $location.path();
$rootScope.firstLoading = true;
$rootScope.pageClass = "page-home";
$rootScope.Home;
$rootScope.User={"status":false};
$rootScope.selectedLang={};
$rootScope.passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");;


$rootScope.payment = {
                        id: '',
                        number: '5555555555554444',
                        expiry_month: '02',
                        expiry_year:  '2018',
                        cvv:  '756'
                      };

$rootScope.checkout={
customer:
         { first_name: '',
           last_name: '',
            email:''
         },
        shipment_method: '1336838094099317449',
        shipment:
                 { first_name: '',
                   last_name: '',
                   address_1: '',
                   city: '',
                   county: '',
                   country: '',
                   postcode: '',
                   phone: ''
                 },
        billing:
                {
                   first_name: '',
                   last_name: '',
                   address_1: '',
                   city: '',
                   county: '',
                   country: '',
                   postcode: '',
                   phone: ''
                 }
 };







 // getting user location



 // $rootScope.getCoordinates=()=>{
 //   navigator.geolocation.getCurrentPosition(function (position) {
 //      console.log(position);
 //      var obj = {};
 //      obj.lat = position.coords.latitude;
 //      obj.lng = position.coords.longitude;
 //      $rootScope.Coordinates= obj;
 //        $rootScope.getLocation($rootScope.Coordinates);
 //
 //    // Show a map centered at (position.coords.latitude, position.coords.longitude).
 //    });
 // }











$rootScope.Location;

// $rootScope.getLocation=(coord)=>{
//   console.log("coord runs");
//   console.log(coord);
//   $http({
//     url: '/locate',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     transformRequest: transformRequestAsFormPost,
//     data: coord
//   })
//    .then(function (response) {
//
//      console.log("updatestock");
//      console.log("getLocation response: ", response);
//     //  for (var i in response.data.results[0].address_components){
//     //    for (var t in response.data.results[0].address_components[i].types){
//     //      if(response.data.results[0].address_components[i].types[t]=="country"){
//           //  var code = response.data.results[0].address_components[i].short_name;
//           var code = response;
//            console.log(code);
//
//
//     //        return false;
//     //      }
//     //    }
//     //  }
//
//    }, function(err){
//      console.log(err);
//
//    });
//
// };









  $rootScope.Auth, $rootScope.Categories;


    $rootScope.authentication = function(){

          // Simple GET request example:
          $http({
            method: 'GET',
            url: '/authenticate'
          }).then(function successCallback(response) {

            if(response.data.access_token || response.data.token){
                console.log("auth");
                console.log(response);
                // this callback will be called asynchronously
                // when the response is available
                $rootScope.Auth = response.data;
                var expires = response.data.expires;
                var identifier = response.data.identifier;
                var expires_in = response.data.expires_in;
                var access_token = response.data.access_token;
                var type = response.data.token_type;

                $rootScope.selectLang(response.data.lang);
                $rootScope.getCategories();
                $rootScope.getProductsFN();


            }



            }, function errorCallback(response) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });

    }//addToCart




    //attaching child to the product object for URL
    $rootScope.attachChild=()=>{
      for (var i in $rootScope.Product){
        for (var c in $rootScope.Product[i].category.data){
          if($rootScope.Product[i].category.data[c].parent != null){
            $rootScope.Product[i].category.child =$rootScope.Product[i].category.data[c].slug
          }
        }
      }
    }

    $rootScope.getProductsFN=function(){
      console.log("getting products");
      $http({method: 'GET', url: '/getProducts'}).then(function(response){
        $rootScope.Product = response.data;
        console.log(response.data);
        $rootScope.attachChild();
        $rootScope.$broadcast("productReady");
        $rootScope.pageLoading = false;
      }, function(error){
        console.log("products status 400");
      });
    }







  //getting product categories
  $rootScope.getCategories = function(){
    $http({method: 'GET', url: '/getCategories'}).then(function(response){
      console.log("categories status 200");
      $rootScope.Categories = response.data;
      console.log(response.data);


    },function(error){
      console.log(error);
      if(response.status == 400){
        console.log("categories status 400");
        console.log("an error occurred in getting the categories");
      }

    });
  }







  setTimeout(function(){
    $rootScope.authentication();
  }, 700);




  $rootScope.showCart = false;
  $rootScope.template={};
  $rootScope.templates = [
                            { name: 'cart', url: 'views/cart.html'},
                            { name: 'shipment', url: 'views/shipment.html'},
                            { name: 'payment', url: 'views/payment.html'},
                            { name: 'processed', url: 'views/processed.html'}
                          ];
  $rootScope.template = $rootScope.templates[0];



// select country

$rootScope.lang = [
  {"code": "US", "country":"US", "language":"English", "selected":false},
  {"code": "IT", "country":"Italy", "language":"Italiano", "selected":false}
]

$scope.openLang = false;

$rootScope.selectLang = $rootScope.lang[1];


$rootScope.selectLang = (code) => {
  for (var l in $rootScope.locales){
    if(code == $rootScope.locales[l].meta.code){
      $rootScope.Locale = $rootScope.locales[l];
    }
  }

  for (var i in $rootScope.lang){
    $rootScope.lang[i].selected = false;
    console.log("codesss", $rootScope.lang[i].code, code);
    if($rootScope.lang[i].code === code){
      $rootScope.lang[i].selected = true;
      $rootScope.selectedLang = $rootScope.lang[i];
      $scope.openLang=false;
      console.log("selected "+$rootScope.lang[i].code+" on purpose");
      return false;
    }
    // console.log($rootScope.lang);
  }
}


$rootScope.selectLang_client = (code) => {
  for (var l in $rootScope.locales){
    if(code == $rootScope.locales[l].meta.code){
      $rootScope.Locale = $rootScope.locales[l];
    }
  }

  for (var i in $rootScope.lang){
    $rootScope.lang[i].selected = false;
    console.log("codesss", $rootScope.lang[i].code, code);
    if($rootScope.lang[i].code === code){
      $scope.setLocation(code);
      $rootScope.lang[i].selected = true;
      $rootScope.selectedLang = $rootScope.lang[i];
      $scope.openLang=false;
      console.log("selected "+$rootScope.lang[i].code+" on purpose");
      return false;
    }
    // console.log($rootScope.lang);
  }
}

// $rootScope.selectedLang = $rootScope.lang[0];
console.log($rootScope.selectedLang);
console.log("lang lang");




$scope.setLocation=(code)=>{
  $rootScope.totalLoading= true;
  console.log(code);
  $http({
    url: '/setLang/'+code,
    method: 'POST'
  })
   .then(function (response) {

    //  $window.location.reload();

     console.log(response);
     $rootScope.getCategories();
     $rootScope.getProductsFN();

     $rootScope.totalLoading= false;



   }, function(err){
     console.log(err);

   });

};









//getting json text meta data

  $rootScope.countries = [];
  $rootScope.locales = {};
  $rootScope.Locale = {};

  $rootScope.getCountries = function(){
    $http({
      method: 'GET',
      url: '/data'
    }).then(function successCallback(response) {
      $rootScope.countries = response.data.countries;
      $rootScope.locales = response.data.locale;
      console.log(response.data);
      // $rootScope.selectLang("IT");
    }, function errorCallback(response) {

      $scope.error = {value: true, text:'countries or locale not available, this page will be reloaded'};
      setTimeout({
        // $route.reload();
      }, 2000);
    });
  };
  $rootScope.getCountries();




















    //..............................................................................MOBILE

    $rootScope.windowHeight = $window.innerHeight;

    jQuery($window).resize(function(){
        $rootScope.windowHeight = $window.innerHeight;
        $rootScope.checkSize();
        $scope.landscapeFunction();
        $scope.$apply();
    });




    //....this is the function that checks the header of the browser and sees what device it is
    $rootScope.isMobile, $rootScope.isDevice, $rootScope.isMobileDevice;
    $rootScope.checkSize = function(){
        $rootScope.checkDevice = {
              Android: function() {
                  return navigator.userAgent.match(/Android/i);
              },
              BlackBerry: function() {
                  return navigator.userAgent.match(/BlackBerry/i);
              },
              iOS: function() {
                  return navigator.userAgent.match(/iPhone|iPad|iPod/i);
              },
              Opera: function() {
                  return navigator.userAgent.match(/Opera Mini/i);
              },
              Windows: function() {
                  return navigator.userAgent.match(/IEMobile/i);
              },
              any: function() {
                  return ($rootScope.checkDevice.Android() || $rootScope.checkDevice.BlackBerry() || $rootScope.checkDevice.iOS() || $rootScope.checkDevice.Opera() || $rootScope.checkDevice.Windows());
              }
          };

        //........checks the width
          $scope.mobileQuery=window.matchMedia( "(max-width: 767px)" );
          $rootScope.isMobile=$scope.mobileQuery.matches;

        //.........returning true if device
          if ($scope.checkDevice.any()){
            $rootScope.isDevice= true;
          }else{
              $rootScope.isDevice=false;
          }

          if (($rootScope.isDevice==true)&&($scope.isMobile==true)){
            $rootScope.isMobileDevice= true;
          }else{
              $rootScope.isMobileDevice=false;
          }




            if ($rootScope.isDevice){
                $rootScope.mobileLocation = function(url){
                  $location.path(url).search();
                }
                $rootScope.mobileExternalLocation = function(url){
                  $window.open(url, '_blank');
                }
            } else if (!$rootScope.isDevice){
                $rootScope.mobileLocation = function(url){
                  return false;
                }
                $rootScope.mobileExternalLocation = function(url){
                  return false;
                }
            }

      }//checkSize
      $rootScope.checkSize();
      $rootScope.landscapeView = false;

     //function removing website if landscape

      $scope.landscapeFunction = function(){

        if ($rootScope.isMobile==true){
            if(window.innerHeight < window.innerWidth){
              $rootScope.landscapeView = true;
              $rootScope.pageLoading = true;
              $(".landscape-view-wrapper").css({
                "width":"100vw",
                "height": "100vh",
                "display": "block"
            });
            }else{
              $rootScope.landscapeView = false;
              $rootScope.pageLoading = false;
            }
        }
      }

    $scope.landscapeFunction();














// $rootScope.Home = [];
// var homeRan = false;
//
//
//     $rootScope.getContentType = function(type, orderField){
//           Prismic.Api('https://viaspadari.cdn.prismic.io/api', function (err, Api) {
//               Api.form('everything')
//                   .ref(Api.master())
//                   .query(Prismic.Predicates.at("document.type", type))
//                   .orderings('['+orderField+']')
//                   .pageSize(100)
//                   .submit(function (err, response) {
//                       var Data = response;
//
//                       if (type =='home'){
//                         $rootScope.Home = response.results;
//                         console.log("home");
//                         console.log(response.results);
//                         if(homeRan == false){
//                           console.log("homeRanReady");
//                           homeRan = true;
//                           setTimeout(function(){
//                             $rootScope.$broadcast('homeRanReady');
//                           }, 900);
//
//                         }else{ return false; }
//
//                       }
//                       // The documents object contains a Response object with all documents of type "product".
//                       var page = response.page; // The current page number, the first one being 1
//                       var results = response.results; // An array containing the results of the current page;
//                       // you may need to retrieve more pages to get all results
//                       var prev_page = response.prev_page; // the URL of the previous page (may be null)
//                       var next_page = response.next_page; // the URL of the next page (may be null)
//                       var results_per_page = response.results_per_page; // max number of results per page
//                       var results_size = response.results_size; // the size of the current page
//                       var total_pages = response.total_pages; // the number of pages
//                       var total_results_size = response.total_results_size; // the total size of results across all pages
//                         return results;
//                   });
//             });
//     };
//


// $scope.setCookie = (obj) => {
//   var cookie;
//   Object.getOwnPropertyNames(obj).forEach(function(val, idx, array) {
//     // console.log(val + ' -> ' + obj[val]);
//    console.log(idx);
//     var thisPart = val + "=" + obj[val] + ";"
//     if(idx==0){
//       cookie = thisPart;
//     }else{
//       cookie = cookie + thisPart;
//     }
//
//     console.log(cookie);
//   });
// }





})//......end of the route controller

.directive('bagDirective', function($rootScope, $location, $window, $routeParams, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'views/icon/bag.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
})


var jquerymousewheel = require('./vendor/jquery.mousewheel.js')($);
var infiniteScroll = require("./vendor/infiniteScroll.js");
var jqueryUI = require('./vendor/jquery-ui.min.js');
var home = require("./home.js");
var nav = require("./nav.js");
var service = require("./services.js");
var cart = require("./shop/cart.js");
var shop = require("./shop/product.js");
var shop = require("./shop/checkout.js");
var user = require("./user.js");
