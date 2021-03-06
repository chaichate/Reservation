angular.module('app.controllers', ['ui.calendar','ionic-timepicker','ionic-datepicker','ngCordova','jrCrop'])
  
.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $localstorage , Loading,$ionicHistory ,  $timeout ) {
  $scope.data = {};

      $scope.toRegis = function() {
         $state.go("regis");
      }

       $scope.toForget = function() {
           $state.go("forget");
       }

     

    
      $scope.login = function() {
      
        Loading.show();
        LoginService.getUser($scope.data.username, $scope.data.password)
        .success(function(data) {

            $ionicHistory.nextViewOptions({
              disableBack: true
             });


          Loading.hide();
           if (parseInt(data.status) == 1) {
             var json =data.result ;

              $localstorage.setObject('acount', {
                    id: json.id ,
                    name: json.name ,
                    email: json.email,
                    image:json.images
               });
               
                $timeout(function () {
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    // $log.debug('clearing cache')
                },300) 
               
                // $ionicHistory.clearCache();
                // $ionicHistory.clearHistory();
                $state.go('tab.calendar', {}, {reload:true} );

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

  
.controller('forgetCtrl', function($scope, LoginService, Loading ,$cordovaToast , $state,  $ionicHistory ) {

       $scope.goBack = function() {
         $ionicHistory.goBack();
        };


      $scope.data = {};
      $scope.forget = function() {

        Loading.show();
        LoginService.forget($scope.data.email)
        .success(function(data) {
          Loading.hide();
           if (parseInt(data.status) == 1) {
               var json =data.result ;
                 $cordovaToast.showShortBottom("ส่งคำร้องขอรัสผ่านใหม่รีบร้อยแล้ว กรุณาตรวสอบอีเมล์ของท่าน", 400); 
            }
            else
            {
                var json =data.result ;
                 $cordovaToast.showShortBottom("อีเมล์ของท่านไม่มีในระบบ กรุณาตรวสอบอีเมล์ของท่าน", 400); 
            }

          }).error(function(data) {
              Loading.hide();
              $cordovaToast.showShortBottom("เกิดข้อผิดพลาดบางประการกรุณาลองอีกครั้ง", 400); 
          });

      }
})

.controller('regisCtrl', function($scope, Loading,$state,$cordovaToast,LoginService,$ionicHistory) {

       $scope.goBack = function() {
         $ionicHistory.goBack();
        };

      $scope.data = {};
      $scope.regis = function($object) {
          
     // console.log(object);
        $scope.submitted = true;

        Loading.show();
        LoginService.regis($object)
        .success(function(data) {
          Loading.hide();
           if (parseInt(data.status) == 1) {
              var json =data.result ;
              $cordovaToast.showShortBottom("ลงทะเบียนเรียบร้อยแล้ว กรุณาเข้าสู่ระบบด้วยค่ะ", 400)
              .then(function(success) {
                $state.go("login"); 
              }, function (error) {
                // error
              });
            }
            else
            {
                 $cordovaToast.showShortBottom( data.msg , 400); 
            }

          }).error(function(data) {
              Loading.hide();
              $cordovaToast.showShortBottom("เกิดข้อผิดพลาดบางประการกรุณาลองอีกครั้ง", 400); 
          });

      }


       $scope.hasError = function(field, validation){
        if(validation){
          return ($scope.form[field].$dirty && $scope.form[field].$error[validation]) || ($scope.submitted && $scope.form[field].$error[validation]);
        }
        return ($scope.form[field].$dirty && $scope.form[field].$invalid) || ($scope.submitted && $scope.form[field].$invalid);
      };

      
})

   
.controller('TodayCtrl' , function($scope,DataBooking,Loading,$state,$localstorage) {

      var acount =$localstorage.getObject('acount');
       var keys = Object.keys(acount);
       var len = keys.length;
       if(len<=0)
       { 
          $state.go('login');

          return ;
       }
         $scope.gotoSetting = function () {
            $state.go("setting");
        };

      $scope.create = function() {
          $state.go("room"); 
      };

       $scope.BookingToday =[];
        // $scope.BookingToday = DataToday.events ;
       Loading.show();
       DataBooking.eventsToday(acount.id).then(function (response) {
          Loading.hide();
          $scope.BookingToday =response.data;
       }, function (err) {
          Loading.hide();
       });
      

      $scope.doRefresh = function() {
         DataBooking.eventsToday(acount.id).then(function (response) {
            $scope.BookingToday =response.data;
         })
         .finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
         });
      };

})
.controller('MybookCtrl', function($scope,DataBooking,Loading,$localstorage,$state) {

    var acount = $localstorage.getObject('acount');
    var keys = Object.keys(acount);
    var len = keys.length;
    if (len <= 0) {
        $state.go('login');

        return;
    }

    $scope.gotoSetting = function () {
        $state.go("setting");
    };



    $scope.create = function () {
        $state.go("room");
    };

    var arr = $localstorage.getObject('acount');
           

    // $scope.MyBooking = DataMybook.events ;
    $scope.MyBooking = [];
    Loading.show();
    DataBooking.eventsMybook(arr.id).then(function (response) {
        Loading.hide();
        $scope.MyBooking = response.data;
    }, function (err) {
        //console.log(err);
        Loading.hide();
    });


    $scope.doRefresh = function () {
        DataBooking.eventsMybook(arr.id).then(function (response) {
            $scope.MyBooking = response.data;
        })
        .finally(function () {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
      

})   
.controller('settingCtrl', function ($scope, $state, $localstorage , $ionicHistory) {
    var acount = $localstorage.getObject('acount');
    var keys = Object.keys(acount);
    var len = keys.length;
    if (len <= 0) {
        $state.go('login');

        return;
    }

    $scope.goBack = function () {
        $ionicHistory.goBack();
    };

    $scope.logOut = function () {
        $localstorage.removeItem('acount');
        $state.go('login');
    }

})
   

      
.controller('formCtrl', function($scope, $stateParams,$ionicHistory, $http , $localstorage , $ionicPopup ,  $state ,Loading ,$cordovaToast , $stateParams) {
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

      var curentID = $stateParams.id ;
       $scope.nameTitle = $stateParams.name ;

     // console.log(curentID);

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
               val=moment(val).tz("Asia/Bangkok").format('YYYY-MM-DD Z');   // +01:00
               
               $scope.master = angular.extend({}, $scope.master ,  {date : val } ); 
               
               // console.log($scope.master)
            }


          };

       var arr= $localstorage.getObject('acount');
       $scope.sendPost = function(timePiker) {
         
            // $scope.timePiker = angular.copy($scope.master);
            // var arr= $localstorage.getObject('acount');
              var object2 = {
                  "member":  arr.id,
                  "room": curentID
              };
           
            var object = angular.extend({}, object2,$scope.master, $scope.timePiker );
            console.log( object );
            
            
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
   
    .controller('acountCtrl', function ($scope, Loading, $state, $cordovaCamera, $localstorage, $ionicHistory,
        $cordovaFileTransfer, $cordovaFile, $cordovaImagePicker, $ionicPlatform ,$jrCrop ) {
        $scope.goBack = function () {
            $ionicHistory.goBack();
        };


        $scope.collection = {
            selectedImage: ''
        };


        $scope.MyAcount = $localstorage.getObject('acount');
        //console.log($scope.MyAcount);

        $scope.fileName = "";

        $ionicPlatform.ready(function () {

                     
            $scope.getImageSaveContact = function () {       
                // Image picker will load images according to these settings
                var options = {
                    maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
                    width: 800,
                    height: 800,
                    quality: 80            // Higher is better
                };

                $cordovaImagePicker.getPictures(options).then(function (results) {
                    // Loop through acquired images
                    for (var i = 0; i < results.length; i++) {
                        $scope.collection.selectedImage = results[i]; 
                        
                        
                        $jrCrop.crop({
                            url: results[i] ,
                            width: 200,
                            height: 200
                        }).then(function(canvas) {
                            // success!
                            var image = canvas.toDataURL();
                            apply( image , $scope.MyAcount.id);
                        }, function() {
                            // User canceled or couldn't load image.
                        });
                        
                        
                        //apply( results[i] , $scope.MyAcount.id);
                        
                        
                        
                         // We loading only one image so we can use it like this
                       // console.log('Image URI: ' + results[i]);
                        // window.plugins.Base64.encodeFile($scope.collection.selectedImage, function (base64) {  // Encode URI to Base64 needed for contacts plugin
                        //     // $scope.addContact();    // Save contact
                        //     apply(base64, $scope.MyAcount.id);
                        //     $scope.collection.selectedImage = base64;
                        //     console.log(base64);
                        // });
                    }
                }, function (error) {
                    console.log('Error: ' + JSON.stringify(error));    // In case of error
                });
            };
            
            
            
            var  apply = function (file_name, id) {


                // Destination URL 
                var url = Target + "/upload.php";
	 
                //File for Upload
                var targetPath = file_name;
                // var targetPath = cordova.file.dataDirectory + file_name;
                // console.log(cordova.file.dataDirectory);
               // console.log(targetPath);
                // File name only
                // var filename = targetPath.split("/").pop();
                var filename = targetPath.substr(targetPath.lastIndexOf('/') + 1);
                //console.log(filename);

                var options = {
                    fileKey: "file",
                    fileName: filename,
                    chunkedMode: false,
                    mimeType: "image/jpg",
                   // headers: { 'headerParam': 'headerValue' },
                    params: { "_METHOD": "UPLOAD", "uid": id, 'directory': 'album', 'fileName': filename } // directory represents remote directory,  fileName represents final remote file name
                };
                
               // console.log(options);
                
                Loading.show();
                $cordovaFileTransfer.upload(encodeURI(url), targetPath, options).then(function (result) {
                    Loading.hide();
                    
                    
                  var  data = JSON.parse(result.response );
                   $scope.MyAcount.image = data.image ; 
                    //console.log(data.image);
                    
                    var json =   $localstorage.getObject('acount');
                    
                     $localstorage.setObject('acount', {
                            id: json.id ,
                            name: json.name ,
                            email: json.email,
                            image: data.image
                     });

                    
                    
                }, function (err) {
                    Loading.hide();
                    console.log("ERROR: " + JSON.stringify(err));
                }, function (progress) {
                    // PROGRESS HANDLING GOES HERE
                });
            }
            
            
            

        });



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
               //$scope.timePiker.title= dataBookCurrent.title ;
              //แก้ไขตรงนี้
              $scope.timePiker = {
                    title: dataBookCurrent.title
               }
             // console.log($scope.timePikertitle);
              
             
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
                
               // console.log(val*1000);
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
                   val=moment(val).tz("Asia/Bangkok").format('YYYY-MM-DD Z');   // +07:00
                   $scope.master = angular.extend({}, $scope.master ,  {date : val } ); 
                   
                   //console.log( $scope.master )
                   
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
            "id": curentID ,
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

   
.controller('bookdescCtrl', function($scope ,$stateParams,DataCalendar,$state, $ionicHistory , $localstorage ) {

     $scope.create = function() {
        $state.go("form"); 
      };

      $scope.goBack = function() {
         $ionicHistory.goBack();
      };

      $scope.title = $stateParams.id;

    //console.log($stateParams.id);
     var arr = $localstorage.getObject('acount');
    //var currentID = $stateParams.id ; 
     DataCalendar.CurrentCalendar(arr.id ,$stateParams.id, "CURRENT").then(function(data){
        $scope.Bookingdesc =data;
     });

})

    .controller('friendCtrl', function ($scope,$ionicPopup, $localstorage, $state, Loading, DataGroup) {
        $scope.addFriend = function () {
            $state.go("addfriend");
        };

        $scope.gotoFind = function () {
            $state.go("findgroup");
        };

        $scope.gotoSetting = function () {
            $state.go("setting");
        };


        var arr = $localstorage.getObject('acount');
        
        var showroom = function(){
       
            $scope.GroupList = {};
            Loading.show();
            DataGroup.eventsALLGroup(arr.id).then(function (response) {
                Loading.hide();
                // console.log(response.data);
                $scope.GroupList = response.data

            }, function (err) {
                //console.log(err);
                Loading.hide();
            });
        }

        showroom();



        $scope.doRefresh = function () {
            showroom()
                .finally(function () {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
        


        $scope.deleteItem = function (id) {

            var confirmPopup = $ionicPopup.confirm({
                title: 'คำยืนยัน',
                template: 'หากคุณต้องการออกจากห้องกรุณายืนยันอีกครั้ง'
            });

            confirmPopup.then(function (res) {
                if (res) {

                    Loading.show();
                    DataGroup.eventsLeaveRoom(id,arr.id ).then(function (response) {
                        Loading.hide();
                        showroom();
                    }, function (err) {
                        Loading.hide();
                    });

                } else {
                    console.log('You are not sure');
                }
            });

        };

    })


.controller('findgroupCtrl', function ($scope, $ionicHistory, $localstorage,  $state, Loading , DataGroup , $cordovaToast) {
   $scope.GroupList = {};
   
   $scope.goBack = function() {
         $ionicHistory.goBack();
    };
   
   
   
    var arr= $localstorage.getObject('acount');
    $scope.find = function (name) {        
       // console.log(name);
        Loading.show();
        DataGroup.eventFindGroup(name,arr.id).then(function (response) {
            $scope.GroupList = response.data
            Loading.hide();
        }, function (err) {
            Loading.hide();
        });
    }
     $scope.pageNumber= -1;
    
    $scope.addgroup = function (groupID, array ,index) {

        Loading.show();
        DataGroup.eventFindAddGroup(groupID, arr.id).then(function (response) {
            var data = response.data;
            Loading.hide();

            array.splice(index, 1);
           
             
            $cordovaToast.showShortBottom(data.message, 400).then(function (success) { });

        }, function (err) {
            Loading.hide();
            $cordovaToast.showShortBottom(err, 400).then(function (success) {
                $state.go("friend");
            });
        });
    }

})
.controller('memberlistCtrl', function ($scope,$ionicModal, $localstorage, $cordovaToast , $stateParams, $ionicHistory, Loading , DataGroup) {
    
    var groupID = $stateParams.id ;
    $scope.nameTitle = $stateParams.name ;
    $scope.MemberList = {};
    
    
    Loading.show();
    
    var showmember =  function() {
        DataGroup.eventMemberListGroup(groupID).then(function (response) {
            $scope.MemberList = response.data    
            Loading.hide();        
        }, function (err) {
            Loading.hide();
        });
        
        return ;
    }
    
    showmember();
    
     $scope.doRefresh = function() {
         showmember()
         .finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
         });
     };
    
    
    
    $scope.goBack = function() {
         $ionicHistory.goBack();
    };
    
    
    $ionicModal.fromTemplateUrl('modal.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up',
        focusFirstInput: true
    });  
    
     $scope.openModal = function() {
        $scope.modal.show();
    };
    
    $scope.hideModal = function() {
        $scope.modal.hide();
    };
    


    $scope.find = function (keyword) {
        Loading.show();
        $scope.addMemberList=[];
        DataGroup.eventMemberNoneGroup(groupID, keyword).then(function (response) {
            $scope.addMemberList = response.data
            Loading.hide();

        }, function (err) {
            Loading.hide();
        });

    }
    
    $scope.addUser = function(data){
       
        Loading.show();
        $scope.addMemberList=[];
        DataGroup.eventSaveNewfriend(data,groupID).then(function (response) {
            var data = response.data ;
            Loading.hide();
            $scope.modal.hide();
            $cordovaToast.showShortBottom(data.message, 400).then(function (success) {
            });  
            
             showmember();
                                 
        }, function (err) {
            Loading.hide();
            $scope.modal.hide();
        });      
    }      
       
})

.controller('addfriendCtrl', function ($scope, $localstorage,  $state, $ionicHistory , DataGroup) {
    $scope.goBack = function () {
       $state.go("tab.friend"); 
    };       
})

.controller('addgroupCtrl', function ($scope, $state, DataGroup, Loading , $cordovaToast,$ionicHistory, $localstorage) {
    var arr= $localstorage.getObject('acount');
    var object2 = {
        "member":  arr.id,
        "_METHOD" : "POST"
    };
    
    $scope.addGroupSubmit = function (dataForm) {

        var obj = angular.extend({}, object2, dataForm);
         $scope.dataRoom = null ;
         //console.log($scope.dataRoom );
        // console.log(obj );
        //console.log(obj);
        Loading.show();
        DataGroup.eventsAdd(obj).then(function (response) {
            $scope.data = null ;
            Loading.hide();
           
           // console.log(response);     
            
            //console.log(data.message);
            $cordovaToast.showShortBottom("สร้างห้องเรียบร้อยแล้ว", 400).then(function (success) {});
            $state.go("tab.friend"); 

        }, function (err) {
            //console.log(err);
            Loading.hide();
        });
    }
    
    
    //  $scope.goback = function() {

    //     $state.go("addfriend"); 
    //  };
     
      $scope.goBack = function () {          

          $state.go("addfriend"); 
      }; 


})
 
.controller('roomCtrl', function($scope,$stateParams,$localstorage,DataGroup,$state, $ionicHistory , Loading , $http) {

     $scope.create = function() {
        $state.go("newroom"); 
      };

      $scope.goBack = function() {
         $ionicHistory.goBack();
      };
      
       var arr = $localstorage.getObject('acount');
        $scope.roomList = {};

         $scope.doRefresh = function() {
            DataGroup.eventsALLGroup(arr.id).then(function (response) {
                $scope.roomList = response.data
            }, function (err) {
                Loading.hide();
            })
         .finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
         });
      };
      
      
     
      $scope.roomList = {};
      Loading.show();
      DataGroup.eventsALLGroup(arr.id).then(function (response) {
          Loading.hide();
          // console.log(response.data);
          $scope.roomList = response.data

      }, function (err) {
          //console.log(err);
          Loading.hide();
      });

       //var currentID = $stateParams.id ; 
        //  Loading.show();
        //  $http({
        //      method: 'POST',
        //      url: Target + "/room.php",
        //      params: { "_METHOD": "GET" },
        //  })
        //      .success(function (data) {
        //          Loading.hide();
        //          $scope.roomList = data;
        //      });




})

.controller('newroomCtrl', function($scope,$ionicHistory , $localstorage ,Loading ,$http , $cordovaToast,DataGroup) {

  
      $scope.goBack = function() {
         $ionicHistory.goBack();
      };


      var arr = $localstorage.getObject('acount');
      $scope.GroupList = {};
      Loading.show();
      DataGroup.eventsALLGroup(arr.id).then(function (response) {
          Loading.hide();
          // console.log(response.data);
          $scope.GroupList = response.data

      }, function (err) {
          //console.log(err);
          Loading.hide();
      });
        
  
      
      
      
      var object2 = {
         "member":  arr.id,
        "_METHOD" : "POST",
      };

      $scope.sendPost = function($data) {

            Loading.show();
            var object = angular.extend({}, object2 ,  $data);

            $http({
              method  : 'POST',
              url     : Target + "/room.php",
              params : {"_METHOD" : "POST"} ,
              data    :object, //forms user object
              headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
             })
              .success(function(data) {
                  Loading.hide();
                  $cordovaToast.showShortBottom("เพิ่มลงข้อมูลเรียบร้อยแล้ว", 400); 
                  $ionicHistory.goBack();
                if (data.errors) {

                  $scope.errorDate = data.errors.date;
                 
                  
                } else {
                  
                  $scope.errorDate =null;
                    

                }
            });

      };


    //   $scope.title = $stateParams.id;

    // //console.log($stateParams.id);
    // var currentID = $stateParams.id ; 
    //  DataCalendar.eventCalendar($stateParams.id).then(function(data){
    //     $scope.Bookingdesc =data;
    //  });

})


.controller('calendarCtrl', ['$scope','$compile','uiCalendarConfig','DataCalendar','$localstorage' , '$state', '$ionicPopup' ,
  function($scope,$compile,uiCalendarConfig , DataCalendar, $localstorage , $state , $ionicPopup) {

      $scope.create = function() {
        $state.go("room"); 
      };
      
        $scope.gotoSetting = function () {
            $state.go("setting");
        };

       var acount =$localstorage.getObject('acount');
       var keys = Object.keys(acount);
       var len = keys.length;
       if(len<=0)
       { 
          $state.go('login');

          return ;
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
      DataCalendar.eventCalendar(acount.id , "GET").then(function(data){

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
         DataCalendar.eventCalendar(acount.id,"GET").then(function(data){

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
 