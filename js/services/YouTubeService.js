app.service('YouTubeService', ['$window', '$rootScope', function ($window, $rootScope) {
	
	var service = this;	// "Pointer" to this service for use in functions with new scope
	var youtube = null;	// Youtube's IFrame API object
	
	// Object containing information for our app
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
	
	}
	
	function onYoutubeStateChange (event) {
		if (event.data == YT.PlayerState.PLAYING) {
			//
		} else if (event.data == YT.PlayerState.PAUSED) {
			//
		} else if (event.data == YT.PlayerState.ENDED) {	
			//service.launchPlayer(upcoming[0].id, upcoming[0].title);
			//service.archiveVideo(upcoming[0].id, upcoming[0].title);
			//service.deleteVideo(upcoming, upcoming[0].id);
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
	
}]);