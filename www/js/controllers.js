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

.controller('CommunityCtrl', function($scope, $state, $firebaseObject){

  $scope.questions = null;
  $scope.users = null;
  $scope.questionText = "What is your question?";

  $scope.loadQuestions = function(){

    var firebaseURI = "https://krav-maga-app.firebaseio.com/";
    var ref = new Firebase(firebaseURI + "community/questions");
    $scope.questions = $firebaseObject(ref);

  };

  $scope.loadUsers = function(){
    var firebaseURI = "https://krav-maga-app.firebaseio.com/";
    var ref = new Firebase(firebaseURI + "users");
    $scope.users = $firebaseObject(ref);
  };

  $scope.askQuestion = function(questionText){

    /* we must first check if the user is logged in. */
    var authData = JSON.parse(localStorage.getItem("krav-maga-app-authData"));
    if(authData === null){
      /* dialog alert that you must be signed in. */
      /* go back to community tab. */
      $state.go("tab.community");
      /* alert the user of failure. */
      navigator.notification.alert(
        'Question was not posted becuase you are not logged in.',  // message
        function(){},         // callback
        'Question was not posted',            // title
        'OK'                  // buttonName
      );
    }
    else{
      /* we can post the question. */

      /* get the id of currently logged in user. */
      var userId = authData.uid;

      /* do a firebase database write. */
      var firebaseURI = "https://krav-maga-app.firebaseio.com/";
      var ref = new Firebase(firebaseURI + "community/questions");
      ref.push({
        'by' : userId,
        'text' : questionText,
        'totalReplies' : 0
      });

      /* go back to community tab. */
      $state.go("tab.community");

      /* alert the user of success. */
      navigator.notification.alert(
        'Question posted successfully.',  // message
        function(){},         // callback
        'Question Posted.',            // title
        'OK'                  // buttonName
      );



    }
  };

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

        /* save user data to firebase */
        var saveRef = new Firebase(firebaseURI + "users/" + authData.uid);
        saveRef.set({
          "name" : authData.facebook.displayName,
          "image" : authData.facebook.profileImageURL

        });
      }

    });

  };

  $scope.logout = function(){
    localStorage.removeItem("krav-maga-app-authData");
    $scope.isLoggedIn = false;
  };


});
