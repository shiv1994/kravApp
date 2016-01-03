angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {

  $scope.isLoggedIn = false;

  /* load user profile information. */
  $scope.load = function(authData){
    $scope.authData = authData || JSON.parse(localStorage.getItem("krav-maga-app-authData"));
    $scope.displayName = $scope.authData.facebook.displayName;
    $scope.profileImageURL = $scope.authData.facebook.profileImageURL;
  };

  /* check if logged in  */
  $scope.check = function(){
    var authData = localStorage.getItem("krav-maga-app-authData");
    if(authData == null) {
      $scope.isLoggedIn = false;
    }
    else {
      /* remember to add unix timestamp check, not acutally correct. */
      $scope.isLoggedIn = true;

      /* do a profile load. */
      $scope.load();
    }
  };

  /* allow user to login application using facebook. */

  $scope.login = function(){
    var firebaseURI = "https://krav-maga-app.firebaseio.com/";
    var ref = new Firebase(firebaseURI);

    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);

        /* set isLoggedIn true. */
        $scope.isLoggedIn = true;

        /* save data in localstorage. */
        localStorage.setItem("krav-maga-app-authData", JSON.stringify(authData));
        /* this load may cause a race condition, need to test, seems to work. */
        $scope.load();
        $scope.$apply();
      }
    });

  };

  $scope.logout = function(){
    localStorage.removeItem("krav-maga-app-authData");
    $scope.isLoggedIn = false;
  };


});
