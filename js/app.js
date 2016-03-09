angular.module('QueueApp', [
  'ngRoute',
  'ngSanitize'
]).config(function ( $routeProvider ) {

	'use strict';
	
	$routeProvider
    .when('/main', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      controllerAs: 'main'
    })
	.when('/room/:room_id', {
      templateUrl: 'views/room.html',
      controller: 'RoomCtrl',
      controllerAs: 'room'
    })
    .otherwise({
      redirectTo: '/main'
    });
}).run(function($rootScope){
  $rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
    console.log(event, current, previous, rejection)
  })
});