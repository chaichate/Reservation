angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider,$provide) {


   $provide.decorator("$ionicPlatform", ["$delegate", function ($delegate) {

    $delegate.$deregisterBackButton = function (actionId) {
      delete $delegate.$backButtonActions[actionId];
    };

    return $delegate;
  }]);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('tab', {
      url: '/tab',
      abstract:true,
      templateUrl: 'templates/tabsController.html'
    })
      
    
              
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

    .state('forget', {
      url: '/forget',
      templateUrl: 'templates/forget.html',
      controller: 'forgetCtrl'
    })


     .state('regis', {
      url: '/regis',
      templateUrl: 'templates/regis.html',
      controller: 'regisCtrl'
    })
    
        
    .state('tab.today', {
      url: '/today',
      views: {
        'tab-today': {
          templateUrl: 'templates/today.html',
          controller: 'TodayCtrl'
        }
      }
    })

    .state('tab.calendar', {
      url: '/calendar',
      views: {
        'tab-calendar': {
          templateUrl: 'templates/calendar.html',
          controller: 'calendarCtrl'
        }
      }
    })
        
      
    
      
        
    .state('tab.setting', {
      url: '/setting',
      views: {
        'tab-setting': {
          templateUrl: 'templates/setting.html',
         controller: 'settingCtrl'
        }
      }
    })
        
         
      
        
    .state('tab.mybooking', {
      url: '/mybooking',
      views: {
        'tab-mybooking': {
          templateUrl: 'templates/mybooking.html',
          controller: 'MybookCtrl'
        }
      }
    })
        
      
        
    .state('form', {
      url: '/form',
      templateUrl: 'templates/booking.html',
      controller: 'formCtrl'
    })
      
      
        
    .state('acount', {
      url: '/acount',
      templateUrl: 'templates/acount.html',
      controller: 'acountCtrl'
    })
        
      
         
        
    .state('bookdesc', {
      url: '/bookdesc/:id',
      templateUrl: 'templates/bookingdesc.html',
      controller: 'bookdescCtrl',
       params: {
          'id': 'some default', 
          'param2': 'some default', 
        }
    })


    .state('edit', {
      url: '/edit/:id',
      templateUrl: 'templates/edit.html',
      controller: 'editCtrl',
    })


    .state('noconnect', {
      url: '/noconnect',
      templateUrl: 'templates/noconnect.html',
      //controller: 'noconnectCtrl'
    })
        
        
    
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/calendar');

});



