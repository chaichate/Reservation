// Ionic Starter App
//var Target = "http://www.baanwebsite.com/customer/bwsapp/meeting";
var Target = "http://192.168.1.222/api";

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers','miniapp', 'app.routes', 'app.services', 'app.directives','ngCordova'])
.run(function($ionicPlatform,$localstorage,$state , $rootScope,$location,$cordovaToast,$timeout,$ionicHistory,$cordovaNetwork,$ionicPopup) {

     
    //ButtonCallback
   var actionId = "preventBack",
      priority = 101,
      
      backButtonCallback = function (e) {
        var backView = $ionicHistory.backView();
       // var currentView = $ionicHistory.currentView();
       // alert(backView);
      
        if (backView) {
          // Look for a backview first, this way we don't interfere with the normal history stack
          // but only runs the close check just before we will actually close the app.
          
          backView.go();
        } else {
          // Go back to default behavior (close the app)
          $ionicPlatform.$deregisterBackButton(actionId); 
          // Show toast 400 pixels from bottom.
          $cordovaToast.showShortBottom("กรุณากดซ้ำอีกครั้งเพื่อออกจากแอพพลิเคชั่น", 400); 
          // Re-register this custom handling after X milliseconds.
          $timeout(function () { 
            $ionicPlatform.registerBackButtonAction(backButtonCallback, priority, actionId);
          }, 2000);
        }
      
        e.preventDefault();
        return false;
      };

  $ionicPlatform.registerBackButtonAction(backButtonCallback, priority, actionId);




      $ionicPlatform.ready(function() {
            if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                       var alertPopup = $ionicPopup.alert({
                          title: "Internet Disconnected",
                          content: "การเชื่อมต่ออินเตอร์เน็ตมีปัญหา"
                       });
                       alertPopup.then(function(res) {
                           ionic.Platform.exitApp();
                       });
                }
            }
      });




      $rootScope.$on('$locationChangeStart', function( event ) {
          var acount =$localstorage.getObject('acount');
           var keys = Object.keys(acount);
           var len = keys.length;
           if(len<=0)
           { 
              $state.go('login');
           }
      });


  
  //$http.defaults.headers.common.Authorization = 'BasicYmVlcDpib29w';	
 // $httpProvider.defaults.headers.post['X-CSRFToken'] = getCookie("csrftoken");
  $ionicPlatform.ready(function($ionicPlatform, $ionicPopup) {


    if(window.cordova && window.cordova.plugins.Keyboard) {s
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
 .constant('Target',Target);
