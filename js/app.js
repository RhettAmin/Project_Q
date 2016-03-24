var app = angular.module('QueueItUpApp', []);

var results = [];
var playlist = [];
var playHistory = [];
var player;

// Load the IFrame Player API code asynchronously
app.run(function () {
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});