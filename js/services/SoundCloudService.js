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
			SC.sound.on('finish', service.broadcastFinish);
		});
	};
	
	/*
	 *	trackTime()
	 *
	 */
	this.trackTime = function () {
		service.interval = window.setInterval(function () {
			service.broadcastTime(SC.sound.currentTime()/1000); // divide 1000 to get seconds
		}, 420);
	}
	
	/*
	 *	stopTimer()
	 *	Stops the time tracker
	 */
	this.stopTimer = function () {
		clearInterval(service.interval);
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
	 *	broadcastFinish()
	 *	Triggers when the track is finished, sends out broadcast to controller
	 */
	this.broadcastFinish = function () {
		$rootScope.$broadcast('eventSCFinish', {});
	};
	
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