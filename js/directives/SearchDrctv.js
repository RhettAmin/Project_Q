/**
 * Directive: Search <search></search>
 */
function search() {
	return {
		restrict: 'E',
		templateUrl: "js/directives/search.tmpl.html"
	};
}

angular.module('QueueApp')
.directive('search', search);