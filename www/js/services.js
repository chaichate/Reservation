angular.module('app.services', ['ionic-timepicker','ionic-datepicker','ngCordovaMocks'])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
	removeItem: function(key) {
     	 $window.localStorage.removeItem(key);
    }

  }
}])

.factory('$cordovaNetwork', [function () {    
  return {    
    getNetwork: function () {
      return "Edge"
    },

    isOnline: function () {
      return true;
    },

    isOffline: function () {
      return false
    }
  }
}])

.service('Loading', function($ionicLoading) {
	return {
		 show : function() {
		    $ionicLoading.show({
		      template: 'Loading...'
		    });
		  },
		  hide : function(){
		    $ionicLoading.hide();
		  }
	}
})

.service('LoginService', function($http){
	return {
		getUser: function($user, $pass){
		
		 	return  $http({
						method: 'GET',
						url: Target +'/index.php' ,
						params : {"uid" : $user , "pass": $pass}
					});
		}	

	};
})
.service('DataBooking', function($http){

	return {
		  eventsToday: function(){
	 		return  $http({
						method: 'GET',
						url: Target +'/booking.php' ,
						//params : {"action" : "today"}
					});
		 },
		 eventsMybook: function(id){
	 		//return  $http.get(Target +'/booking.php', {"uid": 1} );
	 		return  $http({
						method: 'GET',
						url: Target +'/mybooking.php' ,
						params : {"param" : id , "_methed" : "mybooking"}
					});
		 },
		  eventsCurrentBook: function(id,memberID){
	 		//return  $http.get(Target +'/booking.php', {"uid": 1} );
	 		return  $http({
						method: 'GET',
						url: Target +'/mybooking.php' ,
						params : {"param" : id  ,"_methed" : "currentBook", "memberID": memberID }
					});
		 }				
	};

	
})

.service('DataCalendar', function($http,$q){
	return {

		  // events :[
		  // 		  { id: 1,title: '',start: '2015-12-09T12:30:00',url: '#/tab/today' , allDay: true  },
		  //   ]

		  eventCalendar : function(id){        
		  	return  $http({
						method: 'GET',
						url: Target +'/calendar.php' ,
						params : {"params" : id  }
					}).then(function(response){
						return response.data;
					}) ;

			   // var defer = $q.defer();
			   //  $http.get(Target +'/calendar.php').then(function(response) {
			   //    defer.resolve(response.data);
			   //  }, function(response) {
			   //    defer.reject(response);
			   //  });

			   // // console.log(defer.promise);
			   //  return defer.promise;
			}


	};
});


