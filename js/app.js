var app = angular.module('QueueItUpApp', []);

var results = [];		// each item: { id, title, description, thumbnail, author }
var playlist = [];		// each item: { id, title, votes }
var playHistory = [];	// each item: { id, title }
var currentTrack = { id:"", title:"", type:"", state:"stopped" };
var player;

// Initial startup
app.run(function () {

	// Load the Youtube IFrame Player API code asynchronously
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
	// Initialize Soundcloud JS API
	SC.initialize({ client_id: 'cf5e9b27dc6da1f746c13c67a8bca3d0' });
	
});