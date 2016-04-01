app.service('SoundCloudService', ['$window', '$rootScope', function ($window, $rootScope) {
	
	var service = this;		// "Pointer" to this service for use in functions with new scope
	
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
	 *	launchPlayer()
	 *	Loads the player
	 */
	this.launchPlayer = function (id, title) {
	
		SC.stream('/tracks/'+id).then(function (sound) {
			SC.sound = sound;
			SC.sound.play();
			SC.sound.on('finish', service.broadcastFinish);
		});
	};
	
	/*
	 *	broadcastFinish()
	 *	Triggers when the track is finished, sends out broadcast to controller
	 */
	this.broadcastFinish = function () {
		$rootScope.$broadcast('eventSCFinish', {});
	};
	
	/*
	 *	pauseTrack()
	 *	Pauses the track
	 */
	this.pauseTrack = function () {
		if (typeof SC.sound !== 'undefined')
			SC.sound.pause();
	};
	
	/*
	 *	playTrack()
	 *	Plays the track
	 */
	this.playTrack = function () {
		SC.sound.play();
	};
	
}]);