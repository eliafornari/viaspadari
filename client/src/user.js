
var User = angular.module('myApp');


User.controller('userCtrl', function($scope, $location, $rootScope, $routeParams, $timeout,	$http, $sce, $document, anchorSmoothScroll, $window, transformRequestAsFormPost){

$rootScope.windowHeight = $window.innerHeight;
$rootScope.pageClass = "page-user";


$rootScope.User={"status":false};
$rootScope.register;
$scope.registerError;
$scope.loginError;



$rootScope.createUser = (data)=>{

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
    }, function(response) {
        console.error("error in posting");
        console.log(response);
        $scope.registerError = response.data;
        $rootScope.User.status=false;
    })
}


$rootScope.loginUser = (data)=>{

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
    }, function(response) {
      console.error("error in posting");
      console.log(response);
      $scope.loginError = response.data;
      $rootScope.User.status=false;
    })
}



$rootScope.logOut =()=>{
  $rootScope.User={"status":false};
}




});//controller
