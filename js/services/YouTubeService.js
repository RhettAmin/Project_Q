app.service('YouTubeService', ['$window', '$rootScope', function ($window, $rootScope) {
	
	var service = this;		// "Pointer" to this service for use in functions with new scope
	var youtube = null;		// Youtube's IFrame API object
	
	var playlist = null;
	var currentVideo = {
		id: null,
		title: null
	};
	
	/*
	 *	listResults(data)
	 *	Parses the data from a YouTube search and returns a dictionary with
	 *	{id, title, description, thumbnail, author}
	 */
	this.listResults = function (data) {
		results.length = 0;
		for (var i=0; i<data.items.length; i++) {
			results.push( {
				id: data.items[i].id.videoId,
				title: data.items[i].snippet.title,
				description: data.items[i].snippet.description,
				thumbnail: data.items[i].snippet.thumbnails.default.url,
				author: data.items[i].snippet.channelTitle
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
		service.loadPlayer();
		service.hidePlayer();
	};
	
	/*
	 *	onYoutubeReady(event)
	 */
	function onYoutubeReady (event) {
		console.log("Youtube service ready");
	}
	
	/*
	 *	onYoutubeStateChange(event)
	 *	Activates when the player's state changes (play, pause, stop)
	 */
	function onYoutubeStateChange (event) {
		if (event.data == YT.PlayerState.PLAYING) {
			service.broadcastVideoPlay();	// Broadcast to controller that video playing
		} 
		else if (event.data == YT.PlayerState.PAUSED) {
			service.broadcastVideoPause();	// Broadcast to controller that video paused
		} 
		else if (event.data == YT.PlayerState.ENDED) {
			service.broadcastVideoEnd();	// Broadcast to controller that video ended
		} 
		else if (event.data == YT.PlayerState.CUED) {
			service.broadcastVideoCue();
		}
		$rootScope.$apply();
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
	 *	loadPlayer()
	 *	Attempts to destroy then create the player
	 */
	this.loadPlayer = function () {
		service.destroyPlayer();
		youtube = service.createPlayer();
		$rootScope.$apply();
	}
	
	/*
	 *	hidePlayer()
	 *	Hides the youtube player
	 */
	this.hidePlayer = function () {
		document.getElementById('yt_player').style.display = 'none';
	}
	
	/*
	 *	showPlayer()
	 *	Shows the youtube player
	 */
	this.showPlayer = function () {
		document.getElementById('yt_player').style.display = 'block';
	}
	
	/*
	 *	pauseVideo()
	 */
	this.pauseVideo = function () {
		youtube.pauseVideo();
	}
	
	/*
	 *	stopVideo()
	 */
	this.stopVideo = function () {
		youtube.stopVideo();
	}
	
	/*
	 *	launchPlayer(id, title)
	 *	Loads a video into the player
	 */
	this.launchPlayer = function (id, title) {
		youtube.loadVideoById(id);
		currentVideo.id = id;
		currentVideo.title = title;
		return youtube;
	}
	
	/*
	 *	getPlaylist()
	 *	Getter for playlist variable
	 */
	this.getPlaylist = function () {
		return playlist;
	}
	
	/*
	 *	setPlaylist(ctrlPlaylist)
	 *	Setter for playlist variable
	 */
	this.setPlaylist = function (ctrlPlaylist) {
		playlist = ctrlPlaylist;
	}
	
	/*
	 *	getCurrentVideo()
	 *	Getter for current video
	 */
	this.getCurrentVideo = function () {
		return currentVideo;
	}
	
	/*
	 *	setCurrentVideo(id, title)
	 *	Sets the current video info for app
	 */
	this.setCurrentVideo = function (id, title) {
		currentVideo.id = id;
		currentVideo.title = title;
	}
	
	/*
	 *	broadcastVideoEnd()
	 *	Broadcast end of video for controller
	 */
	this.broadcastVideoEnd = function () {
		$rootScope.$broadcast('eventVideoEnd', {
			playlist: playlist,
			currentVideo: currentVideo
		});
	}
	
	/*
	 *	broadcastVideoPause()
	 *	Broadcast end of video for controller
	 */
	this.broadcastVideoPause = function () {
		$rootScope.$broadcast('eventVideoPause', {
			playlist: playlist,
			currentVideo: currentVideo
		});
	}
	
	/*
	 *	broadcastVideoPlay()
	 *	Broadcast playing of video for controller
	 */
	this.broadcastVideoPlay = function () {
		$rootScope.$broadcast('eventVideoPlay', {
			playlist: playlist,
			currentVideo: currentVideo
		});
	}
	
	/*
	 *	broadcastVideoCue()
	 *	Broadcast cue of video (stopped but ready) for controller
	 */
	this.broadcastVideoCue = function () {
		$rootScope.$broadcast('eventVideoCue', {
			playlist: playlist,
			currentVideo: currentVideo
		});
	}
	
}]);