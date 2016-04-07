app.service('YouTubeService', ['$window', '$rootScope', function ($window, $rootScope) {
	
	var service = this;		// "Pointer" to this service for use in functions with new scope
	var youtube = null;		// Youtube's IFrame API object
	var interval = null;
	
	/*
	 *	listResults(data)
	 *	Parses the data from a YouTube search and returns a dictionary with
	 *	{id, title, description, thumbnail, author}
	 */
	this.listResults = function (data) {
		var results = [];
		for (var i=0; i<data.items.length; i++) {
			results.push( {
				id: data.items[i].id.videoId,
				title: data.items[i].snippet.title,
				description: data.items[i].snippet.description,
				thumbnail: data.items[i].snippet.thumbnails.default.url,
				author: data.items[i].snippet.channelTitle,
				duration: data.items[i].duration
			});
		}
		return results;
	};
	
	/*
	 *	onYouTubeIframeAPIReady()
	 *	Activates ones the asynchronous load of YouTube's IFrame API is complete
	 *  Loads the player
	 */
	$window.onYouTubeIframeAPIReady = function () {
		console.log('Youtube IFrame API ready');
		youtube = service.createPlayer();
		$rootScope.$apply();
	};
	
	/*
	 *	onYoutubeReady(event)
	 */
	function onYoutubeReady (event) {
		console.log("Youtube service ready");
		service.broadcastYTServiceReady();
	}
	
	/*
	 *	onYoutubeStateChange(event)
	 *	Activates when the player's state changes (play, pause, stop)
	 */
	function onYoutubeStateChange (event) {
		if (event.data == YT.PlayerState.ENDED) {
			service.stopTimer();
			service.broadcastFinish();	// Broadcast to controller that video finished
		}
		else if (event.data == YT.PlayerState.PAUSED) {
			service.stopTimer();
		}
		else if (event.data == YT.PlayerState.PLAYING) {
			service.broadcastPlaying();	// Required for renabling position slider
		}
		$rootScope.$apply();
	}
	
	/*
	 *	trackTime()
	 *
	 */
	this.trackTime = function () {
		if (service.interval === null) {
			// console.log("YouTube track timer started *"); // DEBUG for timer
			service.interval = window.setInterval(function () {
				service.broadcastTime(youtube.getCurrentTime()); // divide 1000 to get seconds
			}, 200);
		}
	}
	
	/*
	 *	stopTimer()
	 *	Stops the time tracker
	 */
	this.stopTimer = function () {
		// console.log("YouTube track timer ended");	// DEBUG for timer
		clearInterval(service.interval);
		service.interval = null;
	}
	
	/*
	 *	getMaxTime()
	 *	Gets the total duration of the track
	 */
	this.getMaxTime = function () {
		return youtube;
	}
	
	/*
	 *	createPlayer()
	 *	Creates the youtube player
	 */
	this.createPlayer = function () {
		return new YT.Player('yt_player', {
			height: '120',
			width: '200',
			videoId: 'bHQqvYy5KYo',
			events: {
				'onReady': onYoutubeReady,
				'onStateChange': onYoutubeStateChange
			}
		});
	};
	
	/*
	 *	destroyPlayer()
	 *	Destroys the youtube player if it exists
	 */
	this.destroyPlayer = function () {
		if (youtube)
			youtube.destroy();
	}
	
	/*
	 *	playVideo()
	 */
	this.playVideo = function () {
		youtube.playVideo();
		service.trackTime();
	}
	
	/*
	 *	pauseVideo()
	 */
	this.pauseVideo = function () {
		service.stopTimer();
		youtube.pauseVideo();
	}
	
	/*
	 *	stopVideo()
	 */
	this.stopVideo = function () {
		service.stopTimer();
		youtube.stopVideo();
	}
	
	/*
	 *	launchPlayer(id, title)
	 *	Loads a video into the player
	 */
	this.launchPlayer = function (id, title) {
		youtube.loadVideoById(id);
		service.trackTime();
		return youtube;
	}
	
	/*
	 *	setPosition(time)
	 *	Changes the position of the track
	 */
	this.setPosition = function (time) {
		if (typeof youtube !== 'undefined') {
			youtube.seekTo(time, true);
			service.trackTime();
		}
	};
	
	/*
	 *	broadcastFinish()
	 *	Broadcast end of video for controller
	 */
	this.broadcastFinish = function () {
		$rootScope.$broadcast('eventYTFinish', {});
	}
	
	/*
	 *	broadcastPlaying()
	 *	Broadcast playing of video for controller
	 */
	this.broadcastPlaying = function () {
		$rootScope.$broadcast('eventPlaying', {});
	}
	
	/*
	 *	broadcastYTServiceReady()
	 *	Broadcast event stating service is ready for controller
	 */
	this.broadcastYTServiceReady = function () {
		$rootScope.$broadcast('eventYTServiceReady', {});
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