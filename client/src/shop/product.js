var Product = angular.module('myApp');

Product.controller('productCtrl', function($scope, $location, $rootScope, $routeParams, $timeout,	$http, $sce, $document, anchorSmoothScroll, $window, transformRequestAsFormPost){

$rootScope.pageClass = "page-product";
$rootScope.isDetailOpen = false;
$rootScope.windowHeight = $window.innerHeight;
$rootScope.Detail = {};







});//controller

Product.controller('detailCtrl', function($scope, $location, $rootScope, $routeParams, $timeout,	$http, $sce, $document, anchorSmoothScroll, $window, transformRequestAsFormPost){
$rootScope.Detail;
  $scope.$on('$routeChangeSuccess', function(){


    // $scope.$on("productReady", function(){

      console.log("product ready");

      // $rootScope.openDetailFN();
      $rootScope.isDetailOpen = true;
      $rootScope.detailUpdate($routeParams.detail);
      $rootScope.updateCart();

      setTimeout(function(){
        if(!$rootScope.Detail){
          $rootScope.detailUpdate($routeParams.detail);
          $scope.$apply();
          console.log("I loaded it again");
          console.log($rootScope.Detail);
        }else{
          console.log("detail loaded correctly");
          console.log($rootScope.Detail);
          return false
        }
      },3000);

    // })




  });


      $rootScope.addToCart = function(id, quantity){

          $http({
            url: '/addProduct',
            method: 'POST',
            headers: {
              // 'Content-Type': 'application/json'
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: transformRequestAsFormPost,
            data: {
                    id: id,
                    quantity: quantity,
                    access_token:"helloooo"
                  }
          }).then(function(response){
            // $rootScope.Cart = response;
            $rootScope.updateCart();
            $rootScope.pageLoading = false;
            console.log(response);
          }, function(err){
            console.log(err);
          });
    }//addToCart




    //......VARIATIONS

      // $rootScope.addVariation = function(){
      //
      //   if($rootScope.selectedVariation){
      //     $http({
      //       url: '/addVariation',
      //       method: 'POST',
      //       headers: {
      //         // 'Content-Type': 'application/json'
      //         // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      //         // 'Content-Type': 'application/x-www-form-urlencoded'
      //       },
      //       // transformRequest: transformRequestAsFormPost,
      //       data: $rootScope.selectedVariation
      //     }).then(function(response){
      //       // $rootScope.Cart = response;
      //       $rootScope.updateCart();
      //       console.log(response);
      //     });
      //   }else{
      //     $scope.variationErrorMessage = "select a size first"
      //     setTimeout(function(){
      //       $scope.variationErrorMessage = false;
      //       $rootScope.$apply();
      //     });
      //   }
      //
      //
      // }//addToCart



  //detail Update

  $rootScope.detailUpdate = (slug) => {

    console.log("detail update: "+slug);

    for (var i in $rootScope.Product){
      console.log(i);
      if ($rootScope.Product[i].slug == slug){
        $rootScope.Detail=$rootScope.Product[i];
        console.log("detail");
        console.log($rootScope.Detail);
      }
    }
  }




  // $rootScope.showSelection = function(modifier_id){
  //   console.log('modifier_id',modifier_id);
  //   for (var m in $rootScope.Detail.modifiers){
  //     if($rootScope.Detail.modifiers[m].id == modifier_id){
  //       $rootScope.Detail.modifiers[m].open = !$rootScope.Detail.modifiers[m].open;
  //     }
  //   }
  // }
  //
  //
  //
  // $rootScope.thisVariation = function(id, modifier_id, modifier_title, variation_id, variation_title){
  //   var i=0;
  //   for ( i in $rootScope.Detail.modifiers){
  //
  //     if($rootScope.Detail.modifiers[i].id==modifier_id){
  //       $rootScope.selectedVariation[i] =
  //         {
  //           id: id,
  //           modifier_id: modifier_id,
  //           modifier_title: modifier_title,
  //           variation_id: variation_id,
  //           variation_title: variation_title
  //         }
  //         if($rootScope.howManyVAriationsSelected<$rootScope.Detail.total_variations){
  //           $rootScope.howManyVAriationsSelected = $rootScope.howManyVAriationsSelected+1;
  //         }
  //     }
  //   }
  // }


});





Product.directive('detailDirective', function($rootScope, $location, $window, $routeParams, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'views/detail.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
});
