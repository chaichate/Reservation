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
						params : {"uid" : $user , "pass": $pass ,"_methed" : "GET"}
					});
		},
		forget: function($email){
		 	return  $http({
						method: 'GET',
						url: Target +'/index.php' ,
						params : {"email": $email ,"_methed" : "FORGET"}
					});
		},
		regis: function(object){
		 	return  $http({
						method: 'POST',
						url: Target +'/index.php' ,
						params : {"_methed" : "REGISTER"} ,
						data    :object, //forms user object
                  		headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
					});
		},


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
.service('DataGroup', function($http,$q){

	return {
		  eventsAdd: function(obj){
	 		return  $http({
						method: 'POST',
						url: Target +'/group.php' ,
						params : {"_METHOD" : "POST"} ,
                        data    :obj , //forms user object
                        headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
					});
		 },
          eventsALLGroup: function(id){
	 		return  $http({
						method: 'POST',
						url: Target +'/group.php' ,
						params : {"_METHOD" : "GET" , "uid" : id } ,
                       // headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
					});
		 },
          eventFindGroup: function(name, id){
	 		return  $http({
						method: 'POST',
						url: Target +'/group.php' ,
						params : {"_METHOD" : "GETFIND", "name" : name ,"uid" : id   } ,
                       // headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
					});
		 },
          eventFindAddGroup: function(groupID, id){

	 		return  $http({
						method: 'POST',
						url: Target +'/group.php' ,
						params : {"_METHOD" : "PUT", "groupID" : groupID ,"uid" : id   } ,
                       // headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
					});
		 },
         eventMemberListGroup: function(groupID){
	 		return  $http({
						method: 'POST',
						url: Target +'/group.php' ,
						params : {"_METHOD" : "GETLIST", "groupID" : groupID  } ,
                       // headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
					});
		 },
         eventMemberNoneGroup: function(groupID, KeyWord ){
	 		return  $http({
						method: 'POST',
						url: Target +'/group.php' ,
						params : {"_METHOD" : "GETNONEGROUP", "groupID" : groupID , "KeyWord" :KeyWord  } ,
                       // headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
					});
		 },
          eventSaveNewfriend: function(obj , groupID ){
	 		return  $http({
						method: 'POST',
						url: Target +'/group.php' ,
						params : {"_METHOD" : "SAVE_NEW_FRIEND", "groupID" : groupID } ,
                        data    :obj , //forms user object
                        headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
					});
		 },
         eventsLeaveRoom: function(groupID , uid ){
	 		return  $http({
						method: 'POST',
						url: Target +'/group.php' ,
						params : {"_METHOD" : "DELETE", "groupID" : groupID , "uid" : uid } ,
                      // data    :obj , //forms user object
                      //  headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
					});
		 },
         
         
         
        
         
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
})
.service('RequestsService', function($http,$q, $ionicLoading ){
    
	   var base_url = 'http://{YOUR SERVER}';

        function register(device_token){

            var deferred = $q.defer();
            $ionicLoading.show();

            $http.post(base_url + '/register', {'device_token': device_token})
                .success(function(response){

                    $ionicLoading.hide();
                    deferred.resolve(response);

                })
                .error(function(data){
                    deferred.reject();
                });


            return deferred.promise;

        };


        return {
            register: register
        };
})

;


