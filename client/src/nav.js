angular.module('myApp')


.controller('navCtrl', function($scope, $location, $rootScope, $routeParams, $timeout,	$http){

  $rootScope.isNavOpen = false;
  $scope.categoryOpen = 'food';

  $scope.thisCategory =(cat)=>{
    if($scope.categoryOpen == cat){
      $scope.categoryOpen ='';
    }else{
      $scope.categoryOpen = cat;
    }
  }

  $scope.openNav = function(){
    $rootScope.isNavOpen = !$rootScope.isNavOpen;
  }

  $scope.closeNav = function(){
    $rootScope.isNavOpen = false;
  }

  $rootScope.isLocation= (location)=>{
  $scope.$on('$routeChangeSuccess', function(){
    console.log(location);

    if ($location.path()==location){
      console.log(true);
      return true;
    }else{console.log(location); return false; }
      })
  }

  $rootScope.isShopDetail = ()=>{
    if($location.path()=='/shop/'+$routeParams.detail){
      return true;
    }else{return false;}

  }

  // $scope.$on('$routeChangeStart', function(){
  //   if(($location.path()=='/shop') || ($location.path()=='/shop/'+$routeParams.detail)){
  //     console.log("isShop");
  //     $rootScope.pageLoading = false;
  //   }else{
  //     $rootScope.pageLoading = true;
  //   }
  //
  // })

  $scope.$on('$routeChangeSuccess', function(){
    if($location.path() != '/'){
      console.log('not home');
      $rootScope.backgroundColor = '#FFFFFF';
    }
    setTimeout(function(){
      $rootScope.pageLoading = false;
      $rootScope.$apply();
    }, 1000);
  })


})


.directive('logoDirective', function($rootScope, $location, $window, $routeParams, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'views/icon/logo.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
})

.directive('logoBlackDirective', function($rootScope, $location, $window, $routeParams, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'views/icon/logo-black.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
})

.directive('exDirective', function($rootScope, $location, $window, $routeParams, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'views/icon/ex.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
})



.directive('mailDirective', function($rootScope, $location, $window, $routeParams, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'views/icon/mail-icon.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
})




.directive('menuIconDirective', function($rootScope, $location, $window, $routeParams, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'views/icon/menu-icon.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
})

.directive('navmobileDirective', function($rootScope, $location, $window, $routeParams, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'views/nav-mobile.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
})



.directive('navDirective', function($rootScope, $location, $window, $routeParams, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'views/nav.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
});
