/**
 * Controller: MainCtrl
 */
function MainCtrl ( ) {
	'use strict';
	this.title = "Queue It Up!";
	
	this.updateTitle = function () {
		this.title = "Testing this function.";
	};
	
}
 
 
angular.module('QueueApp')
.controller('MainCtrl', MainCtrl);