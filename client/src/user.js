
var User = angular.module('myApp');


User.controller('userCtrl', function($scope, $location, $rootScope, $routeParams, $timeout,	$http, $sce, $document, anchorSmoothScroll, $window, transformRequestAsFormPost){

$rootScope.windowHeight = $window.innerHeight;
$rootScope.pageClass = "page-user";

$rootScope.User={"status":false};
$rootScope.register;
$scope.registerError;
$rootScope.loginError;
$rootScope.editError;
$rootScope.userEdit = false;

$rootScope.setUserEmailInForm = ()=>{
  $rootScope.checkout.customer.email = $rootScope.User.data.email;
  $rootScope.checkout.customer.first_name = $rootScope.User.data.first_name;
  $rootScope.checkout.customer.last_name = $rootScope.User.data.last_name;
}

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

    $rootScope.User.data=response.data.result;
    $rootScope.User.status=true;
    console.log(response);
    console.log("posted successfully");
    $rootScope.pageLoading = false;
    $rootScope.setUserEmailInForm();
    if(!$rootScope.showCart){
      $location.path('/account');
    }

    }, function(response) {
        console.error("error in posting");
        console.log(response);
        $scope.registerError = response.data.result;
        $rootScope.User.status=false;
        $rootScope.pageLoading = false;
    })
}




$rootScope.loginUser = (data)=>{
  $rootScope.pageLoading = true;
  console.log("loginUser");
  console.log(data);

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
      if(!$rootScope.showCart){
        $location.path('/account');
      }
      console.log(response);
      console.log("posted successfully");
      $rootScope.pageLoading = false;
      $rootScope.getUserOrders($rootScope.User.data.id);
      $rootScope.setUserEmailInForm();
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


$rootScope.getUserOrders = (id)=>{
  console.log(id);
  $http({
    url: '/user/'+id+'/order',
    method: 'GET',
  }).then( function(response){
      console.log(response);
      $rootScope.User.order = response.data;

    }, function(response) {

      console.log(response);

    })
}





//....EDIT USER

$rootScope.editUser=(value)=>{
  console.log(value);
  $rootScope.userEdit = value;
  console.log($rootScope.userEdit);
}

$rootScope.saveUser=(data)=>{
  $rootScope.pageLoading = true;

  console.log(data);

  $http({
    url: '/editUser',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: transformRequestAsFormPost,
    data: data
  }).then( function(response){

    $rootScope.User.data=response.data.result;
    $rootScope.User.status=true;
    console.log(response);
    console.log("posted successfully");
    $rootScope.pageLoading = false;
    $rootScope.setUserEmailInForm();
    $rootScope.userEdit = false;
    if(!$rootScope.showCart){
      $location.path('/account');
    }

    }, function(response) {
        console.error("error in posting");
        console.log(response);
        $rootScope.userEdit = true;
        $scope.editError = response.data.result;
        $rootScope.User.status=false;
        $rootScope.pageLoading = false;
    })

};


console.log($routeParams.token);


$rootScope.resetPassword = (data)=>{

  console.log(data);

  $http({
    url: '/user/resetPassword',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: transformRequestAsFormPost,
    data: data
  }).then( function(response){
      console.log(response);

    }, function(response) {
        console.error("error in posting");
        console.log(response);

        $scope.resetError = response.data.result;

    })
};


$rootScope.newpasswordSave = (data)=>{

  console.log(data);

  $http({
    url: '/user/newPassword',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: transformRequestAsFormPost,
    data: data
  }).then( function(response){
      console.log(response);

      $scope.outcome = response.data;

    }, function(response) {
        console.error("error in posting");
        console.log(response);

        $scope.newPasswordError = response.data.result;

    })
};





});//controller



User.directive("compareTo", function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});
