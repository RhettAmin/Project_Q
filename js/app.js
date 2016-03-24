var app = angular.module('QueueItUpApp', []);

var results = [];
var playlist = [];
var playHistory = [];
var player;

// Runs initially
app.run(function () {

	// Load the Youtube IFrame Player API code asynchronously
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});