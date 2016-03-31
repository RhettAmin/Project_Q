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
	
	// Initialize Soundcloud IFrame Player
	var sc_frame = document.getElementById('sc_player');
	initSC_IFrame(sc_frame);
	//var sc_player = SC_widget.Widget(sc_frame);
	
	// Initialize Soundcloud JS API
	SC.initialize({ client_id: 'cf5e9b27dc6da1f746c13c67a8bca3d0' });
	
});

function initSC_IFrame(sc_frame) {
	//sc_frame.setAttribute('src','https://w.soundcloud.com/player/?url="http://api.soundcloud.com/tracks/13158665');
	//sc_frame.setAttribute('width','100%');
	//sc_frame.setAttribute('height','250px');
	//sc_frame.setAttribute('scrolling','no');
	//sc_frame.setAttribute('frameborder','no');
	//sc_frame.setAttribute('show_comments','no');
	sc_frame.setAttribute('style','display:none');
}