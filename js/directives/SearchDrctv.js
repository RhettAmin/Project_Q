/**
 * Directive: Search <search></search>
 */
angular.module('QueueApp')
  .directive('search', function SearchbarDrctv () {
    'use strict';

    return {
      restrict: 'EA',
      replace: true,
      scope: true,
      templateUrl: "js/directives/search.tmpl.html",
      controllerAs: 'search',

      controller: function (SearchFactory) {
        this.results = [];
		
		this.pickSong = function (id) {
			SearchFactory.pickSong(id);
		};
		
        this.searchSong = function (query) {
          SearchFactory.searchSong(query);
        };
        
        SearchFactory.getResults()
          .then( angular.bind( this, function then() {
              this.results = SearchFactory.results;
            }) );

      },

      link: function (scope, element, attrs, ctrl) {
        
      }
    }
  });