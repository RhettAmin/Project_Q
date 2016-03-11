/**
 * Controller: MainCtrl
 */
function MainCtrl($scope, $http, ytSearch) {
	
	var main = this;
	main.title = "Angular test page";
	
	main.results = ['test1','test2'];
	
	$scope.search = function() {
		ytSearch.search.async().then( function(response) {
			main.results = ytSearch.parseResultData(response.data);
		});
	}
	
	$scope.listResults = function() {
		return ytSearch.listResults();
	}
}
 
 
angular.module('QueueApp')
.controller('MainCtrl', MainCtrl);