app.service('SoundCloudService', ['$window', '$rootScope', function ($window, $rootScope) {
	
	var service = this;		// "Pointer" to this service for use in functions with new scope
	var timeTracking = false;
	
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
			service.playTrack();
			SC.sound.on('finish', service.broadcastFinish);
		});
	};
	
	/*
	 *	trackTime()
	 *
	 */
	this.trackTime = function () {
		if (service.timeTracking) {
			service.broadcastTime(SC.sound.currentTime()/1000); // divide 1000 to get seconds
			setTimeout(service.trackTime,200);
		}
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
		service.timeTracking = false;
	};
	
	/*
	 *	playTrack()
	 *	Plays the track
	 */
	this.playTrack = function () {
		SC.sound.play();
		service.timeTracking = true;
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
	 *	
	 */
	this.broadcastTime = function (time) {
		$rootScope.$broadcast('eventTime', {
			time: time
		});
	}
	
	
}]);