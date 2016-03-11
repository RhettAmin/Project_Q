
function router($routeProvider) {
	
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
}

function rootScope ($rootScope) {
	$rootScope
	.$on('$routeChangeError', function (event, current, previous, rejection) {
		console.log(event, current, previous, rejection)
  });
}


// Create module
angular.module('QueueApp', ['ngRoute'])
.config(router)
.run(rootScope);