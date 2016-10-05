
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




  $rootScope.getContentType('home', 'my.home.index');

  $rootScope.$on('homeReady', function(){
      $scope.homeImages = $rootScope.Home[0].data['home.image'].value;
      // $scope.assignimage(0);
      $scope.$apply();

  });


//   $scope.assignimage = (i)=>{
//     $scope.currentImage = $scope.homeImages[i];
//   }
//
//   // Returns a random integer between min (included) and max (included)
//   // Using Math.round() will give you a non-uniform distribution!
//   function getRandomIntInclusive(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
//   }
//
//   var prev ={
//     x:1,
//     y:1
//   }
//
//   $(document).mousemove(function(event){
//     // console.log('y',event.pageX);
//     // console.log('x',event.pageY);
//     var mloc = {
//         x: event.pageX,
//         y: event.pageY
//     };
//
//
//     var diffX = Math.abs(prev.x - mloc.x);
//     var diffY = Math.abs(prev.y - mloc.y);
//
//     prev=mloc;
//
//     if((diffX > 1) || (diffY > 1)){
//       var number = getRandomIntInclusive(0, 42);
//       $scope.assignimage(number);
//       $scope.$apply();
//     }
//
// });


// $(document).addEventListener("keydown", function(event) {
//   console.log(event.which);
// }

});//controller
