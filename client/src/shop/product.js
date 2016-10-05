var Product = angular.module('myApp');
Product.filter('productFilter', function ($sce, $routeParams, $rootScope) {
    return function(data) {
      var category = $routeParams.category;
      var filtered = [];
      console.log('category: '+category);
      for (var i in $rootScope.Product){
        for (var c in $rootScope.Product[i].category.data){
          if($rootScope.Product[i].category.data[c].slug == category){
            filtered = filtered.concat($rootScope.Product[i]);
            console.log(filtered);
          }
        }

      }
      return filtered;
    };
  })
Product.controller('productCtrl', function($scope, $location, $rootScope, $routeParams, $timeout,	$http, $sce, $document, anchorSmoothScroll, $window, transformRequestAsFormPost){

$rootScope.pageClass = "page-product";
$rootScope.isDetailOpen = false;
$rootScope.windowHeight = $window.innerHeight;
$rootScope.Detail = {};





$rootScope.showCart = false;
$rootScope.template={};
$rootScope.templates = [
                          { name: 'cart', url: 'views/cart.html'},
                          { name: 'shipment', url: 'views/shipment.html'},
                          { name: 'payment', url: 'views/payment.html'},
                          { name: 'processed', url: 'views/processed.html'}
                        ];
$rootScope.template = $rootScope.templates[0];




});//controller

Product.controller('detailCtrl', function($scope, $location, $rootScope, $routeParams, $timeout,	$http, $sce, $document, anchorSmoothScroll, $window, transformRequestAsFormPost){

  $scope.$on('$routeChangeSuccess', function(){

    // $rootScope.openDetailFN();
    $rootScope.isDetailOpen = true;
    $rootScope.detailUpdate($routeParams.detail);
    $rootScope.updateCart();

    setTimeout(function(){
      if(!$rootScope.Detail.id){
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


  });


      $rootScope.addToCart = function(id){

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
                    access_token:"helloooo"
                  }
          }).then(function(response){
            // $rootScope.Cart = response;
            $rootScope.updateCart();
            $rootScope.pageLoading = false;
            console.log(response);
          });
    }//addToCart




    //......VARIATIONS

      $rootScope.addVariation = function(){

        if($rootScope.selectedVariation){
          $http({
            url: '/addVariation',
            method: 'POST',
            headers: {
              // 'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
              // 'Content-Type': 'application/x-www-form-urlencoded'
            },
            // transformRequest: transformRequestAsFormPost,
            data: $rootScope.selectedVariation
          }).then(function(response){
            // $rootScope.Cart = response;
            $rootScope.updateCart();
            console.log(response);
          });
        }else{
          $scope.variationErrorMessage = "select a size first"
          setTimeout(function(){
            $scope.variationErrorMessage = false;
            $rootScope.$apply();
          });
        }


      }//addToCart














  //variations

  $rootScope.selectedVariation = {};
  $rootScope.howManyVAriationsSelected = 0;
  $rootScope.detailUpdate = (slug) => {

    $rootScope.selectedVariation={};
    $rootScope.howManyVAriationsSelected = 0;
    $rootScope.Detail.total_variations=0;

    for (var i in $rootScope.Product){
      if ($rootScope.Product[i].slug == slug){
        $rootScope.Detail=$rootScope.Product[i];
        $rootScope.Detail.total_variations=0;
        $rootScope.Detail.has_variation = $rootScope.has_variation;

        var go = true;
        //has variation
        for (i in $rootScope.Detail.modifiers){
          $rootScope.Detail.modifiers[i].open = false;
          $rootScope.Detail.total_variations =$rootScope.Detail.total_variations+1;
          // if($rootScope.Detail.modifiers[i].id){$rootScope.has_variation=true;}else{$rootScope.has_variation=false;}
          $rootScope.Detail.has_variation = true;
          $rootScope.showSelection($rootScope.Detail.modifiers[i].id);
            go = false;
        }

        if(go==true){
          //does not have variation
          $rootScope.Detail.has_variation = false;
          for (i in $rootScope.Detail.modifiers){

          }

        }

      }
    }
  }




  $rootScope.showSelection = function(modifier_id){
    console.log('modifier_id',modifier_id);
    for (var m in $rootScope.Detail.modifiers){
      if($rootScope.Detail.modifiers[m].id == modifier_id){
        $rootScope.Detail.modifiers[m].open = !$rootScope.Detail.modifiers[m].open;
      }
    }
  }



  $rootScope.thisVariation = function(id, modifier_id, modifier_title, variation_id, variation_title){
    var i=0;
    for ( i in $rootScope.Detail.modifiers){

      if($rootScope.Detail.modifiers[i].id==modifier_id){
        $rootScope.selectedVariation[i] =
          {
            id: id,
            modifier_id: modifier_id,
            modifier_title: modifier_title,
            variation_id: variation_id,
            variation_title: variation_title
          }
          if($rootScope.howManyVAriationsSelected<$rootScope.Detail.total_variations){
            $rootScope.howManyVAriationsSelected = $rootScope.howManyVAriationsSelected+1;
          }
      }

    }
  }


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
