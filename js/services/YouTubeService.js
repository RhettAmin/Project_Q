app.service('YouTubeService', ['$window', '$rootScope', function ($window, $rootScope) {
	
	var service = this;		// "Pointer" to this service for use in functions with new scope
	var youtube = null;		// Youtube's IFrame API object
	
	var playlist = null;
	var currentVideo = {
		videoId: null,
		videoTitle: null
	};
	
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
	
	$window.onYouTubeIframeAPIReady = function () {
		service.loadPlayer();
		$rootScope.$apply();
	};
	
	function onYoutubeReady (event) {
		console.log("Youtube service ready");
	}
	
	function onYoutubeStateChange (event) {
		if (event.data == YT.PlayerState.PLAYING) {
			//
		} else if (event.data == YT.PlayerState.PAUSED) {
			//
		} else if (event.data == YT.PlayerState.ENDED) {
			service.broadcastVideoEnd();
		}
		$rootScope.$apply();
	}
	
	this.createPlayer = function () {
		return new YT.Player('player', {
			height: '120',
			width: '200',
			videoId: 'bHQqvYy5KYo',
			events: {
				'onReady': onYoutubeReady,
				'onStateChange': onYoutubeStateChange
			}
		});
	};
	
	this.loadPlayer = function () {
		if (youtube)
			youtube.destroy();
		youtube = service.createPlayer();
	}
	
	this.launchPlayer = function (id, title) {
		youtube.loadVideoById(id);
		currentVideo.videoId = id;
		currentVideo.videoTitle = title;
		console.log(youtube);
		return youtube;
	}
	
	this.getPlaylist = function () {
		return playlist;
	}
	
	this.setPlaylist = function (ctrlPlaylist) {
		playlist = ctrlPlaylist;
	}
	
	this.setCurrentVideo = function (id, title) {
		currentVideo.videoId = id;
		currentVideo.videoTitle = title;
	}
	
	this.broadcastVideoEnd = function () {
		$rootScope.$broadcast('eventVideoEnd', {	// Broadcast end of video for controller
			playlist: playlist,
			currentVideo: currentVideo
		});
	}
	
}]);