app.service('SoundCloudService', ['$window', '$rootScope', function ($window, $rootScope) {
	
	var service = this;		// "Pointer" to this service for use in functions with new scope
	var interval;
	
	/*	listResults(data)
	 *	Parses the data from a SoundCloud search and returns a dictionary with
	 *	{id, title, description, thumbnail, author}
	 */
	this.listResults = function (data) {
		var results = [];
		for (var i=0; i<data.length; i++) {
			results.push( {
				id: data[i].id,
				title: data[i].title,
				description: data[i].description,
				thumbnail: data[i].artwork_url,
				author: data[i].username,
				duration: data[i].duration/1000
			});
		}
		return results;
	};
	
	
	/*
	 *	launchPlayer()
	 *	Loads the player
	 */
	this.launchPlayer = function (id, title) {
	
		SC.stream('/tracks/'+id).then(function (sound) {
			SC.sound = sound;
			service.sound = sound;
			service.playTrack();
			SC.sound.on('finish', service.broadcastFinish);	 // Listener for track finish
			SC.sound.on('seeked', service.broadcastPlaying); // Listener for renabling position slider
		});
		service.broadcastPlaying();
	};
	
	/*
	 *	trackTime()
	 *
	 */
	this.trackTime = function () {
		if (service.interval === null) {
			// console.log("SoundCloud track timer started *");	// DEBUG for timer
			service.interval = window.setInterval(function () {
				service.broadcastTime(SC.sound.currentTime()/1000); // divide 1000 to get seconds
			}, 200);
		}
	}
	
	/*
	 *	stopTimer()
	 *	Stops the time tracker
	 */
	this.stopTimer = function () {
		// console.log("SoundCloud track timer ended");		// DEBUG for timer
		clearInterval(service.interval);
		service.interval = null;
	}
	
	/*
	 *	getMaxTime()
	 *	Gets the total duration of the track
	 */
	this.getMaxTime = function () {
		return SC.sound.streamInfo.duration/1000;
	}
	
	/*
	 *	pauseTrack()
	 *	Pauses the track
	 */
	this.pauseTrack = function () {
		if (typeof SC.sound !== 'undefined')
			SC.sound.pause();
		service.stopTimer();
	};
	
	/*
	 *	playTrack()
	 *	Plays the track
	 */
	this.playTrack = function () {
		SC.sound.play();
		service.trackTime();
	};
	
	/*
	 *	setPosition(time)
	 *	Changes the position of the track
	 */
	this.setPosition = function (time) {
		if (typeof SC.sound !== 'undefined')
			SC.sound.seek(time*1000);
		service.trackTime();
	};	
	
	/*
	 *	broadcastFinish()
	 *	Triggers when the track is finished, sends out broadcast to controller
	 */
	this.broadcastFinish = function () {
		$rootScope.$broadcast('eventSCFinish', {});
	};
	
	/*
	 *	broadcastPlaying()
	 *	Broadcast playing of video for controller
	 */
	this.broadcastPlaying = function () {
		$rootScope.$broadcast('eventPlaying', {});
	}
	
	/*
	 *	broadcastTime()
	 *	Broadcasts the time event to the controller
	 */
	this.broadcastTime = function (time) {
		$rootScope.$broadcast('eventTime', {
			time: time
		});
	}
	
	
}]);