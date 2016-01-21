

angular.module('miniapp', []).filter('moment', function() {
	//var jun.tz('Asia/Bangkok').format('ha z'); 
	//var newYork    = moment.tz("2014-06-01 12:00", "America/New_York");

    return function(dateString, format) {
        return moment(dateString).format(format);


    };
});