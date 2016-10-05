
var Home = angular.module('myApp');

Home.filter('youtubeEmbed', function ($sce) {
    return function(url) {
      if (url){
        var riskyVideo = "https://www.youtube.com/embed/"+url+"?rel=0&amp;&autoplay=1&controls=1&loop=1&showinfo=0&modestbranding=1&theme=dark&color=white&wmode=opaque";
        return $sce.trustAsResourceUrl(riskyVideo);
        $scope.$apply();
      }
    };
  })

Home.controller('homeCtrl', function($scope, $location, $rootScope, $routeParams, $timeout,	$http, $sce, $document, anchorSmoothScroll, $window){

$rootScope.windowHeight = $window.innerHeight;
$rootScope.pageClass = "page-home";



$scope.homeImages = [];
$scope.currentImage;



  //
  // $rootScope.getContentType('home', 'my.home.index');
  //
  // $rootScope.$on('homeReady', function(){
  //     $scope.homeImages = $rootScope.Home[0].data['home.image'].value;
  //     // $scope.assignimage(0);
  //     $scope.$apply();
  //
  // });



});//controller
