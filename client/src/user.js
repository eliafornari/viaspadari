
var User = angular.module('myApp');


User.controller('userCtrl', function($scope, $location, $rootScope, $routeParams, $timeout,	$http, $sce, $document, anchorSmoothScroll, $window, transformRequestAsFormPost){

$rootScope.windowHeight = $window.innerHeight;
$rootScope.pageClass = "page-user";

$rootScope.User={"status":false};
$rootScope.register;
$scope.registerError;
$rootScope.loginError;



$rootScope.createUser = (data)=>{
  $rootScope.pageLoading = true;

  $http({
    url: '/createUser',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: transformRequestAsFormPost,
    data: data
  }).then( function(response){

    $rootScope.User.data=response.data;
    $rootScope.User.status=true;
    console.log(response);
    console.log("posted successfully");
    $rootScope.pageLoading = false;
    }, function(response) {
        console.error("error in posting");
        console.log(response);
        $scope.registerError = response.data;
        $rootScope.User.status=false;
        $rootScope.pageLoading = false;
    })
}


$rootScope.loginUser = (data)=>{
  $rootScope.pageLoading = true;

  $http({
    url: '/loginUser',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: transformRequestAsFormPost,
    data: data
  }).then( function(response){
      $rootScope.User.data=response.data.result;
      $rootScope.User.status=true;
      $location.path('/account');
      console.log(response);
      console.log("posted successfully");
      $rootScope.pageLoading = false;
    }, function(response) {
      console.error("error in posting");
      console.log(response);
      $rootScope.loginError = response.data;
      $rootScope.User.status=false;
      $rootScope.pageLoading = false;
    })
}



$rootScope.logOut =()=>{
  $rootScope.User={"status":false};
}




});//controller
