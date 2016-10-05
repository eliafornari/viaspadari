angular.module('myApp')


// .filter('replaceDash', function($location, $rootScope, $routeParams, $sce){
// return function(item){
//   item = item.replace(/-/g, '.');
//   var year = item.substring(0, 4);
//   var month = item.substring(5, 7);
//   var day = item.substring(8, 9);
//
//   console.log('year: '+year);
//   console.log('month: '+month);
//   console.log('day: '+day);
//
//   // item = '<span>'+month+'</span>'+'.'+'<span>'+day+'</span>'+'.'+'<span>'+year+'</span>'
//   item = {'year':year, 'month':month, 'day':day};
//   console.log(item);
//   return item
// }
//
//
// })

.controller('eventCtrl', function($scope, $location, $rootScope, $routeParams, $timeout,	$http, $sce, $document, anchorSmoothScroll, $window){

$rootScope.windowHeight = $window.innerHeight;
$rootScope.pageClass = "page-event";
$rootScope.selectedEvent = {};


//..........................................................GET


  $rootScope.getContentType('event', 'my.event.date desc');

  $rootScope.$on('eventReady', function(){


      for (var i in $rootScope.Event){
        var item = $rootScope.Event[i].data['event.date'].value
        console.log(i);
        // item = item.replace(/-/g, '.');
        var year = item.substring(0, 4);
        var month = item.substring(5, 7);
        var day = item.substring(8, 10);

        // console.log('year: '+year);
        // console.log('month: '+month);
        // console.log('day: '+day);
        item = {'year':year, 'month':month, 'day':day};

        console.log(item);
        $rootScope.Event[i].data['event.date'].value = item;


      }
      $rootScope.pageLoading = false;
      $rootScope.$apply();

  });



  $scope.thisEvent = (e)=>{
    $rootScope.selectedEvent = e;
  }

});//controller
