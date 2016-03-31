app.service('SoundCloudService', ['$window', '$rootScope', function ($window, $rootScope) {
	
	var service = this;		// "Pointer" to this service for use in functions with new scope
	var sc_player = null;	// SoundCloud's player object
	var sc_player_frame = document.getElementById('sc_player');
	// SC_widget = variable loaded from SoundCloud Widget API
	// SC		 = variable loaded from SoundCloud JS API
	
	var playlist = null;
	var currentVideo = {
		id: null,
		title: null
	};
	
	/*	listResults(data)
	 *	Parses the data from a SoundCloud search and returns a dictionary with
	 *	{id, title, description, thumbnail, author}
	 */
	this.listResults = function (data) {
		results.length = 0;
		for (var i=0; i<data.length; i++) {
			results.push( {
				id: data[i].id,
				title: data[i].title,
				description: data[i].description,
				thumbnail: data[i].artwork_url,
				author: data[i].username
			});
		}
		return results;
	};
	
	/*
	 *	setTrack(track_id)
	 *	Sets the track src attribute for the player iframe
	 */
	this.setTrack = function (track_id) {
		sc_player_frame.setAttribute('src','https://w.soundcloud.com/player/?url="http://api.soundcloud.com/tracks/'+track_id);
	};
	
	/*
	 *	loadPlayer()
	 *	Loads the player
	 */
	this.loadPlayer = function () {
		sc_player_frame.style.display = 'block';
		sc_player = SC_widget.Widget(sc_player_frame);
		service.sc_player = sc_player;
		service.bindEventListeners(sc_player);
	};
	
	/*
	 *	bindEventListeners()
	 *	Binds event listeners to the SoundCloud player. 
	 */
	this.bindEventListeners = function (sc_player) {
		sc_player.bind(SC_widget.Widget.Events.READY, service.eventPlayerReady);
		sc_player.bind(SC_widget.Widget.Events.PLAY, service.eventPlayerPlaying);
		sc_player.bind(SC_widget.Widget.Events.PAUSE, service.eventPlayerPaused);
		sc_player.bind(SC_widget.Widget.Events.FINISH, service.eventPlayerFinished);
	};
	
	
	/*
	 *	launchPlayer()
	 *	Loads the player
	 */
	this.launchPlayer = function (id, title) {
		service.setTrack(id);
		service.loadPlayer();
	};
	
	/*
	 *	destroyPlayer()
	 *	Closes the player
	 */
	this.destroyPlayer = function () {
		sc_player = null;
		sc_player_frame.setAttribute('src','');
	};
	
	
	/*
	 *	eventPlayerReady() 
	 *	Event listener that checks for player becoming ready, then broadcasts
	 *	an event to the controller
	 */
	this.eventPlayerReady = function() {
		$rootScope.$broadcast('eventSCReady', {});
    };
	
	/*
	 *	eventPlayerPlaying() 
	 *	Event listener that checks for play event
	 */
	this.eventPlayerPlaying = function() {
		$rootScope.$broadcast('eventSCPlaying', {});
    };
	
	/*
	 *	eventPlayerPaused() 
	 *	Event listener that checks for pause event
	 */
	this.eventPlayerPaused = function() {
		$rootScope.$broadcast('eventSCPaused', {});
    };
	
	/*
	 *	eventPlayerFinished() 
	 *	Event listener that checks for finish event
	 */
	this.eventPlayerFinished = function() {
		$rootScope.$broadcast('eventSCFinished', {});
    };
	
	
}]);