angular.module('myApp')


.filter('turnIntoSoundcloud', function($sce){
  return function(id) {
    if (id){

      id = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/'+id+'&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true';
console.log(id);
      return $sce.trustAsResourceUrl(id);
    }
  };
})


.controller('radioCtrl', function($scope, $location, $rootScope, $routeParams, $timeout,	$http, $sce, $document, anchorSmoothScroll, $window){

$rootScope.windowHeight = $window.innerHeight;
$rootScope.pageClass = "page-radio";
$rootScope.selectedRadio = {};


//..........................................................GET


  $rootScope.getContentType('radio', 'my.radio.index');

  $rootScope.$on('radioReady', function(){
      $rootScope.pageLoading = false;
      $scope.$apply();
  });


  $scope.thisRadio = (e)=>{
    $rootScope.selectedRadio = e;
  }



$rootScope.isSoundOpen = false


$rootScope.openSound = function(){
  $rootScope.isSoundOpen = !$rootScope.isSoundOpen
}

$scope.radioHovered = false;




});//controller
