



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

    console.log("detail update: "+slug);

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
