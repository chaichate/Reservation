angular.module('app.controllers', ['ui.calendar','ionic-timepicker','ionic-datepicker','ngCordova'])
  
.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $localstorage , Loading) {
      $scope.data = {};
      $scope.login = function() {
        // LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
        //     $state.go('tab.calendar');
        // }).error(function(data) {
        //     var alertPopup = $ionicPopup.alert({
        //         title: 'ไม่สามารถเข้าสู่ระบบได้',
        //         template: 'กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่านของ'
        //     });
        // });
        
        Loading.show();
        LoginService.getUser($scope.data.username, $scope.data.password)
        .success(function(data) {
          Loading.hide();
           if (parseInt(data.status) == 1) {
             var json =data.result ;

              $localstorage.setObject('acount', {
                    id: json.id ,
                    name: json.name ,
                    email: json.email,
                    image:json.images
               });

                $state.go('tab.calendar');
            }
            else
            {
               Loading.hide();
                var alertPopup = $ionicPopup.alert({
                  title: 'ไม่สามารถเข้าสู่ระบบได้',
                  template: 'กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่านของ'
               });

            }


          }).error(function(data) {
              Loading.hide();
               var alertPopup = $ionicPopup.alert({
                  title: 'ไม่สามารถเข้าสู่ระบบได้',
                  template: 'เกิดข้อผิดพลาดบางประการ ' + data
               });
          });
     }
})

   
.controller('TodayCtrl' , function($scope,DataBooking,Loading,$state) {

      $scope.create = function() {
        $state.go("form"); 
      };

       $scope.BookingToday =[];
        // $scope.BookingToday = DataToday.events ;
       Loading.show();
       DataBooking.eventsToday().then(function (response) {
          Loading.hide();
          $scope.BookingToday =response.data;
       }, function (err) {
          Loading.hide();
       });
      

      $scope.doRefresh = function() {
         DataBooking.eventsToday().then(function (response) {
            $scope.BookingToday =response.data;
         })
         .finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
         });
      };

})
.controller('MybookCtrl', function($scope,DataBooking,Loading,$localstorage,$state) {
       $scope.create = function() {
        $state.go("form"); 
      };

      var arr= $localstorage.getObject('acount');
           

     // $scope.MyBooking = DataMybook.events ;
      $scope.MyBooking =[];
       Loading.show();
       DataBooking.eventsMybook( arr.id).then(function (response) {
         Loading.hide();
          $scope.MyBooking =response.data;
       }, function (err) {
         //console.log(err);
          Loading.hide();
       });


      $scope.doRefresh = function() {
         DataBooking.eventsMybook( arr.id).then(function (response) {
              $scope.MyBooking =response.data;
         })
         .finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
         });
      };
      

})   
.controller('settingCtrl', function($scope,$state,$localstorage) {
     $scope.logOut = function() {
          $localstorage.removeItem('acount');
          $state.go('login');
     }

})
   

      
.controller('formCtrl', function($scope, $stateParams,$ionicHistory, $http , $localstorage , $ionicPopup ,  $state ,Loading ,$cordovaToast) {
    //console.log($stateParams.movieid);
     $scope.goBack = function() {
         $ionicHistory.goBack();
      };

        $scope.inputDate = "กรุณาคลิกเพื่อเลือกวันที่";
        $scope.master = {
            //"date" :  new Date , 
            //"start" : ((new Date()).getHours() * 60 * 60) ,
            //"end" : (((new Date()).getHours() +1) * 60 * 60 ),
        };

   

        $scope.timePickerObject = {
         inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
          step: 10,  //Optional
          format: 24,  //Optional
          titleLabel: 'เลือกเวลาที่เริ่ม',  //Optional
          setLabel: 'Set',  //Optional
          closeLabel: 'Close',  //Optional
          setButtonType: 'button-positive',  //Optional
          closeButtonType: 'button-stable',  //Optional
          callback: function (val) {    //Mandatory
            timePickerCallback(val);
          }
        };


         $scope.timePickerObjectEnd = {
            inputEpochTime: (((new Date()).getHours() +1) * 60 * 60 ),  //Optional
            step: 10,  //Optional
            format: 24,  //Optional
            titleLabel: 'เลือกเวลาสิ้นสุด',  //Optional
            closeLabel: 'Cancel',  //Optional
            setLabel: 'Set',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
              timePickerObjectEndCallback(val);
            }
          };





         function timePickerCallback(val) {

          if (typeof (val) === 'undefined') {
            console.log('Time not selected');
          } else {
            var selectedTime = new Date(val * 1000);
             $scope.timePickerObject.inputEpochTime = val;
             $scope.master = angular.extend({}, $scope.master ,  {start :selectedTime } ); 

              // console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
          }
        }


         function timePickerObjectEndCallback(val) {
            if (typeof (val) === 'undefined') {
              console.log('Time not selected');
            } else {
              $scope.timePickerObjectEnd.inputEpochTime = val;
                   var selectedTime = new Date(val * 1000);
                    // $scope.master.push = {end :selectedTime }
                      $scope.master = angular.extend({}, $scope.master ,  {end :selectedTime } ); 
                 //  $scope.timePiker.end = selectedTime;
                  //console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
            }
          }


      var disabledDates = [];    
      var weekDaysList =  ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
      var monthList = ["ม.ค.", "ก.พ", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    
       $scope.datepickerObject = {
            titleLabel: 'กรุณาเลือกวันที่', //Optional
            todayLabel: 'Today', //Optional
            closeLabel: 'Close', //Optional
            setLabel: 'Set', //Optional
            errorMsgLabel : 'Please select time.', //Optional
            setButtonType : 'button-assertive', //Optional
            modalHeaderColor:'bar-positive', //Optional
            modalFooterColor:'bar-positive', //Optional
            templateType:'modal', //Optional
           // inputDate:  $scope.inputDate ,  //Optional
            weekDaysList: weekDaysList, //Optional
            mondayFirst: true, //Optional
            disabledDates:disabledDates, //Optional
            monthList:monthList, //Optional
            from: new Date(2015, 7, 1), //Optional
            to: new Date(2016, 7, 1), //Optional
            callback: function (val) { //Optional
              datePickerCallback(val);
            }
    };

        var datePickerCallback = function (val) {
           
            if (typeof(val) === 'undefined') {
               $scope.inputDate = "กรุณาเลือกวันที่" ;
               $scope.master = angular.extend({}, $scope.master ,  {date : "" } ); 
            } else {
              console.log('Selected date is : ', val)
               $scope.inputDate =val ;
               $scope.master = angular.extend({}, $scope.master ,  {date : val } ); 
            }


          };

       var arr= $localstorage.getObject('acount');
       $scope.sendPost = function(timePiker) {
         
            // $scope.timePiker = angular.copy($scope.master);
            // var arr= $localstorage.getObject('acount');
              var object2 = {
                  "member":  arr.id,
              };
           
            var object = angular.extend({}, $scope.timePiker, object2,$scope.master);
            //console.log( object );
             Loading.show();


            $http({
                  method  : 'POST',
                  url     : Target + "/booking.php",
                  data    :object, //forms user object
                  headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                 })
                  .success(function(data) {
                     Loading.hide();


                    if (data.errors) {

                      $scope.errorDate = data.errors.date;
                      $scope.errorStart= data.errors.start;
                      $scope.errorEnd = data.errors.end;
                      $scope.errorTitle = data.errors.title;
                      
                    } else {
                      //$scope.message = data.message;
                      $scope.errorDate =null;
                      $scope.errorStart= null;
                      $scope.errorEnd =null;
                      $scope.errorTitle = null;
                      $cordovaToast.showShortBottom( data.message, 400).then(function(success) {
                            $state.go('tab.mybooking' ,{}, {reload: true});
                      });
                  
                    }
                })
                .error(function(data) {
                    Loading.hide();
                    $cordovaToast.showShortBottom( "เกิดข้อผิดพลาดบางประการ", 400); 
                });

      };

    


})
   
.controller('acountCtrl', function($scope , $state , $localstorage, $ionicHistory) {
     $scope.goBack = function() {
         $ionicHistory.goBack();
      };
     

      $scope.MyAcount  = $localstorage.getObject('acount');
      //console.log($scope.MyAcount );
})


.controller('editCtrl', function($scope ,$state ,DataBooking,$localstorage, $ionicHistory,$stateParams,Loading,$http,$ionicPopup ) {
     $scope.goBack = function() {
         $ionicHistory.goBack();
      };

     var curentID = $stateParams.id ;

      $scope.delete = function() {

        var confirmPopup = $ionicPopup.confirm({
             title: 'คำยืนยัน',
             template: 'หากคุณต้องการลบกรุณายืนยัน?'
           });

           confirmPopup.then(function(res) {
             if(res) {

                 Loading.show();

                   $http({
                      method: 'GET',
                      url: Target +'/booking.php' ,
                      params : {"params" : curentID , "_METHOD" : "DELETE" },
                       headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                    }).then(function(data){

                      Loading.hide();

                       if (data.errors) {

                              var alertPopup = $ionicPopup.alert({
                                title: 'แจ้งเตือน',
                                template: data.errors
                              });
                                  
                       }
                       else
                       {
                            // var alertPopup = $ionicPopup.alert({
                            //     title: 'แจ้งเตือน',
                            //     template: data.message
                            // });
                            alert("ลบข้อมูลเรียบร้อยแล้วค่ะ");

                            $state.go('tab.mybooking' ,{}, {reload: true});
                       }

                    }) ;

             } else {
               console.log('You are not sure');
             }
           });


      };

      var arr= $localstorage.getObject('acount');
      $scope.master ={};
      $scope.MyBooking =[];

  
           Loading.show();
           DataBooking.eventsCurrentBook(curentID ,arr.id).then(function (response) {
               Loading.hide();
               var dataBookCurrent = response.data;
               datePickerCallback(dataBookCurrent.date); 
               timePickerCallback(dataBookCurrent.start);
               timePickerObjectEndCallback(dataBookCurrent.end)
              
             
           }, function (err) {
             //console.log(err);
              Loading.hide();
          });


        $scope.timePickerObject = {
         inputEpochTime:  (((new Date()).getHours() +1) * 60 * 60 ),  //Optional
          step: 10,  //Optional
          format: 24,  //Optional
          titleLabel: 'เลือกเวลาที่เริ่ม',  //Optional
          setLabel: 'Set',  //Optional
          closeLabel: 'Close',  //Optional
          setButtonType: 'button-positive',  //Optional
          closeButtonType: 'button-stable',  //Optional
          callback: function (val) {    //Mandatory
            timePickerCallback(val);
          }
        };


         $scope.timePickerObjectEnd = {
            inputEpochTime: (((new Date()).getHours() +1) * 60 * 60 ),  //Optional
            step: 10,  //Optional
            format: 24,  //Optional
            titleLabel: 'เลือกเวลาสิ้นสุด',  //Optional
            closeLabel: 'Cancel',  //Optional
            setLabel: 'Set',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
              timePickerObjectEndCallback(val);
            }
          };




        var disabledDates = [];    
        var weekDaysList =  ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
        var monthList = ["ม.ค.", "ก.พ", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

        $scope.datepickerObject = {
            titleLabel: 'กรุณาเลือกวันที่', //Optional
            todayLabel: 'Today', //Optional
            closeLabel: 'Close', //Optional
            setLabel: 'Set', //Optional
            errorMsgLabel : 'Please select time.', //Optional
            setButtonType : 'button-assertive', //Optional
            modalHeaderColor:'bar-positive', //Optional
            modalFooterColor:'bar-positive', //Optional
            templateType:'modal', //Optional
           // inputDate:  $scope.inputDate ,  //Optional
            weekDaysList: weekDaysList, //Optional
            mondayFirst: true, //Optional
            disabledDates:disabledDates, //Optional
            monthList:monthList, //Optional
            from: new Date(2015, 7, 1), //Optional
            to: new Date(2016, 7, 1), //Optional
            callback: function (val) { //Optional
              datePickerCallback(val);
            }
        };




        function timePickerCallback(val) {

            if (typeof (val) === 'undefined') {
              console.log('Time not selected');
            } else {
              var selectedTime = new Date(val * 1000);
               $scope.timePickerObject.inputEpochTime = val;
               $scope.master = angular.extend({}, $scope.master ,  {start :selectedTime } ); 

                // console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
            }
          }


           function timePickerObjectEndCallback(val) {
              if (typeof (val) === 'undefined') {
                console.log('Time not selected');
              } else {
                $scope.timePickerObjectEnd.inputEpochTime = val;
                     var selectedTime = new Date(val * 1000);
                      // $scope.master.push = {end :selectedTime }
                        $scope.master = angular.extend({}, $scope.master ,  {end :selectedTime } ); 
                   //  $scope.timePiker.end = selectedTime;
                    //console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
              }
            }


           var datePickerCallback = function (val) {
                           
                if (typeof(val) === 'undefined') {
                   $scope.inputDate = "กรุณาเลือกวันที่" ;
                   $scope.master = angular.extend({}, $scope.master ,  {date : "" } ); 
                } else {
                  console.log('Selected date is : ', val)
                   $scope.inputDate =val ;
                   $scope.master = angular.extend({}, $scope.master ,  {date : val } ); 
                }


            };



        // $scope.inputDate = "กรุณาคลิกเพื่อเลือกวันที่";
        // $scope.master = {
        //     "date" :  new Date , 
        //     "start" : ((new Date()).getHours() * 60 * 60) ,
        //     "end" : (((new Date()).getHours() +1) * 60 * 60 ),
        // };

    // $scope.inputDate = new Date(item[n].date), 
    //                     $scope.master = {
    //                         "date" :  new Date(item[n].date), 
    //                         "start" : new Date(1970, 0, 1, date.getHours(), date.getMinutes(), 0),
    //                         "end" : new Date(1970, 0, 1, e.getHours(), e.getMinutes(), 0),
    //                     };
       // console.log($scope.master.date );
       //console.log(moment( $scope.master.date ).format('MMMM Do YYYY, h:mm:ss a'));

       

       var arr= $localstorage.getObject('acount');
        var object2 = {
            "member":  arr.id,
            "_METHOD" : "PUT",
        };

       $scope.sendPost = function(timePiker) {
           
             Loading.show();
            var object = angular.extend({}, object2 , $scope.master,  $scope.timePiker);
            //console.log(object);

            $http({
                  method  : 'POST',
                  url     : Target + "/booking.php",
                  data    :object, //forms user object
                  headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                 })
                  .success(function(data) {
                      Loading.hide();

                    if (data.errors) {

                      $scope.errorDate = data.errors.date;
                      $scope.errorStart= data.errors.start;
                      $scope.errorEnd = data.errors.end;
                      $scope.errorTitle = data.errors.title;
                      
                    } else {
                      //$scope.message = data.message;
                        var alertPopup = $ionicPopup.alert({
                          title: 'แจ้งเตือน',
                          template: data.message
                        });

                          //$scope.timePiker =null;
                          $scope.errorDate =null;
                          $scope.errorStart= null;
                          $scope.errorEnd =null;
                          $scope.errorTitle = null;

                    }
                });

      };


    

      //$scope.MyAcount  = $localstorage.getObject('acount');
      //console.log($scope.MyAcount );
})

   
.controller('bookdescCtrl', function($scope,$stateParams,DataCalendar,$state, $ionicHistory) {

     $scope.create = function() {
        $state.go("form"); 
      };

      $scope.goBack = function() {
         $ionicHistory.goBack();
      };

      $scope.title = $stateParams.id;

    //console.log($stateParams.id);
    var currentID = $stateParams.id ; 
     DataCalendar.eventCalendar($stateParams.id).then(function(data){
        
        $scope.Bookingdesc =data;

        // for (var i = 0; i < data.length; i++) {
        //  if(currentID==data[i].id )
        //  {
        //   console.log( data[i]  );
        //   break;
        //  }
          
        //};
     });


})


.controller('calendarCtrl', ['$scope','$compile','uiCalendarConfig','DataCalendar','$localstorage' , '$state', '$ionicPopup' ,
  function($scope,$compile,uiCalendarConfig , DataCalendar, $localstorage , $state , $ionicPopup) {

      $scope.create = function() {
        $state.go("form"); 
      };

      var acount =$localstorage.getObject('acount');
      var keys = Object.keys(acount);
      var len = keys.length;
      //console.log(len);
      if(len<=0)
      {
         $state.go('login');
      }

       


   $scope.eventSources = [];
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
	
     $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    // $scope.eventSource = {
    //         url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
    //         className: 'gcal-event',           // an option!
    //         currentTimezone: 'America/Chicago' // an option!
    // };

    /* event source that contains custom events on the scope */
     $scope.events = [];
   

    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      // var s = new Date(start).getTime() / 1000;
      // var e = new Date(end).getTime() / 1000;
      // var m = new Date(start).getMonth();
      var events = [];
      callback(events);
    };

    $scope.calEventsExt = {
       color: '#c7d7eb',
       textColor: '#fff',
       events: [ 
          //{type:'party',title: 'Lunch',start: new Date(y, m, d+2, 12, 0),allDay: true},
        ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        //$scope.alertMessage = (date.title + ' was clicked ');
        //alert("xxxx");
        var result = { id: date.date };
        $state.go('bookdesc', result );
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) { 
        element.attr({'tooltip': event.title,
                     'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
  
   
    /* event sources array*/
    //$scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
      DataCalendar.eventCalendar().then(function(data){

            $scope.uiConfig = {
              calendar:{
                lang: 'th' ,
                height: 450,
                editable: false,
                allDayDefault : true,
                header:{
                left: 'title',
                center: '',
                right: 'today prev,next' ,
               
              },
              events :  data ,
              eventClick: $scope.alertOnEventClick,
              eventDrop: $scope.alertOnDrop,
              eventResize: $scope.alertOnResize,
              eventRender: $scope.eventRender
              }
            };
            
           // console.log(data);
             //$scope.eventSources = [$scope.calEventsExt, $scope.eventsF, $scope.events];
              
      }); 

     $scope.eventSources = [$scope.calEventsExt, $scope.eventsF, $scope.events];


     $scope.doRefresh = function() {
         DataCalendar.eventCalendar().then(function(data){

            $scope.uiConfig = {
              calendar:{
                lang: 'th' ,
                height: 450,
                editable: false,
                allDayDefault : true,
                header:{
                left: 'title',
                center: '',
                right: 'today prev,next' ,
               
              },
              events :  data ,
              }
            };
            
         })
         .finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
         });
      };
   
    
    

}]);
 