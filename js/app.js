var app = angular.module('QueueItUpApp', []);

var results = [];		// each item: { id, title, description, thumbnail, author }
var playlist = [];		// each item: { id, title, votes }
var playHistory = [];	// each item: { id, title }
var currentTrack = { id:"", title:"", type:"", state:"stopped" };
var player;
// SC_widget = variable loaded from SoundCloud Widget API
// SC		 = variable loaded from SoundCloud JS API

// Initial startup
app.run(function () {

	// Load the Youtube IFrame Player API code asynchronously
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
	// Initialize Soundcloud IFrame Player
	var sc_player_frame = document.getElementById('sc_player');
	readySCFrame(sc_player_frame);
	
	// Initialize Soundcloud JS API
	SC.initialize({ client_id: 'cf5e9b27dc6da1f746c13c67a8bca3d0' });
});

/*
 *	readySCFrame()
 *	Sets attributes for the SoundCloud iframe to work (except 'src' attribute)
 */
function readySCFrame(sc_player_frame) {
	sc_player_frame.style.display = 'block';
	sc_player_frame.setAttribute('width','100%');
	sc_player_frame.setAttribute('height','150px');
	sc_player_frame.setAttribute('scrolling','false');
	sc_player_frame.setAttribute('frameborder','false');
	sc_player_frame.setAttribute('show_comments','false');
	sc_player_frame.setAttribute('sharing','false');
	sc_player_frame.setAttribute('download','false');
	sc_player_frame.setAttribute('liking','false');
	sc_player_frame.setAttribute('buying','false');
};