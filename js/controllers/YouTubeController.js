app.controller('YouTubeController', function ($scope, $http, YouTubeService) {
	
	/*
	 *	search()
	 *	For Searching Youtube videos
	 */
	$scope.search = function () {
		$http.get('https://www.googleapis.com/youtube/v3/search', {	// Make an api call with search query
			params: {
				key: 'AIzaSyC4yvdM2ovZJfXdOnWlgbDQGbAK0dD1te0',
				type: 'video',
				maxResults: '8',
				part: 'id,snippet',
				fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
				q: this.query
			}
		})
		.success( function (data) {		// On success
			$scope.results = YouTubeService.listResults(data);	// List the results
		})
		.error( function (err) {
			console.log(err);
		});
    }
	
	/*
	 *	addVideo(id, title)
	 *	Adds a Youtube video to the playlist
	 */
	$scope.addVideo = function (id, title) {
		playlist.push({id:id,title:title});	// push id and title to the playlist variable
		
		// ** Visual feedback showing added to playlist will go here **
		
		if (playlist.length == 1) {				// Start playing if its the only video in the list
			$scope.playVideo(playlist[0].id, playlist[0].title);
		}
		$scope.playlist = playlist;				// Set playlist variable in scope for html
		YouTubeService.setPlaylist(playlist);	// Set playlist variable in YT service
    }
	
	/*
	 *	playVideo(id, title)
	 *	Plays a video in the YouTube player
	 */
	$scope.playVideo = function (id, title) {
		YouTubeService.launchPlayer(id, title);
		YouTubeService.showPlayer();
    };
	
	/*
	 *	removeVideo(id, title)
	 *	Removes a video from the playlist and adds it to the play history
	 */
	$scope.removeVideo = function (id, title) {
		for (var i=0; i<playlist.length; i++) {
			if (playlist[i].id === id) {
				playHistory.push({id:id,title:title});
				playlist.splice(i,1);
				break;
			}
		}
		$scope.playlist = playlist;
		$scope.playHistory = playHistory;
		YouTubeService.setPlaylist(playlist);
		if (playlist.length <= 0) {
			YouTubeService.hidePlayer();
		}
	}
	
	/*
	 *	Listener for broadcast from service stating the end of a video
	 *	Pops a video off the top of the playlist and plays the next video
	 */
	$scope.$on('eventVideoEnd', function(event, data) {
        console.log("video ended");
		$scope.removeVideo(data.currentVideo.videoId);
		if (playlist.length > 0)
			$scope.playVideo(playlist[0].id, playlist[0].title);
		else
			YouTubeService.hidePlayer();
    });
	
	
});