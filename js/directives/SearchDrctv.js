/**
 * Directive: Search <search-bar></search-bar>
 */
 function searchBar () {
    'use strict';

    return {
      restrict: 'EA',
      replace: true,
      scope: true,
      templateUrl: "js/directives/search.tmpl.html",
      controllerAs: 'search',

      controller: function () {
        
		this.songName = "Test song name";
		
      },

      link: function (scope, element, attrs, ctrl) {
        
      }
    }
  }
 
 
angular.module('QueueApp')
.controller('search', searchBar);