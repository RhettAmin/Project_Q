app.controller('MainCtrl', function ($scope, $http, YouTubeService) {
	
	/*
	 *	search()
	 *	For Searching tracks
	 */
	$scope.search = function (type) {
		
		console.log("Search of type: "+type);
		if (type === "youtube" ) {
			
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
		} else if (type === "soundcloud") {
			
			// TODO: Soundcloud search functionality will go here
		}
    };
	
	/*
	 *	addTrack(id, title, type)
	 *	Adds a Youtube video to the playlist
	 */
	$scope.addTrack = function (id, title, type) {
		
		// Add the YouTube video to the playlist
		playlist.push({
			id:id,
			title:title,
			votes:0,
			type:type
		});
		
		// TODO: Visual feedback showing added to playlist will go here
		
		if (playlist.length == 1) {				// Start playing if its the only video in the list
			$scope.playTrack(playlist[0].id, playlist[0].title, type);
		}
		$scope.playlist = playlist;				// Set playlist variable in scope for html
		YouTubeService.setPlaylist(playlist);	// Set playlist variable in YT service
    };
	
	/*
	 *	playTrack(id, title, type)
	 *	Plays a video in the YouTube player
	 */
	$scope.playTrack = function (id, title, type) {
		if (type === "youtube") {
			YouTubeService.launchPlayer(id, title);
			YouTubeService.showPlayer();
			$scope.updateCurrentTrack(id, title, type, 'playing');
		}
    };
	
	/*
	 *	removeTrack(id, title)
	 *	Removes a video from the playlist and adds it to the play history
	 */
	$scope.removeTrack = function (id, title) {
		for (var i=0; i<playlist.length; i++) {
			if (playlist[i].id === id) {
				playHistory.push({id:id,title:title,type:playlist[i].type});
				playlist.splice(i,1);
				break;
			}
		}
		
		$scope.playlist = playlist;
		$scope.playHistory = playHistory;
		YouTubeService.setPlaylist(playlist);
		
		var currentVid = YouTubeService.getCurrentVideo().id;
		if (playlist.length <= 0) {					// If no videos left
			YouTubeService.stopVideo();				//  Stop Video
			YouTubeService.hidePlayer();			//  Hide player
		} else if (currentVid === id) {				// If currently playing video deleted 
			$scope.playTrack(playlist[0].id, playlist[0].title, playlist[0].type); // Play next video
		}
		
	};
	
	/*
	 *	upvote(id)
	 *	Upvotes an item in the playlist
	 */
	$scope.upvote = function (id) {
		for (var i=0; i<playlist.length; i++) {
			if (playlist[i].id === id) {
				playlist[i].votes += 1;
				break;
			}
		}
		
		$scope.playlist = playlist;
		YouTubeService.setPlaylist(playlist);
	};
	
	/*
	 *	downvote(id)
	 *	Downvotes an item in the playlist
	 */
	$scope.downvote = function (id) {
		for (var i=0; i<playlist.length; i++) {
			if (playlist[i].id === id) {
				playlist[i].votes -= 1;
				break;
			}
		}
		
		$scope.playlist = playlist;
		YouTubeService.setPlaylist(playlist);
	};
	
	/*
	 *	updateCurrentTrack(id, title, type)
	 *	Updates the current track values in each service and main scope
	 */
	$scope.updateCurrentTrack = function (id, title, type, state) {
		$scope.currentTrack = { id:id, title:title, type:type, state:state };
		YouTubeService.setCurrentVideo(id, title);
	};
	
	/*
	 *	updateCurrentState(state)
	 *	Updates the current track's state (playing, stopped, or paused)
	 */
	$scope.updateCurrentState = function (state) {
		$scope.currentTrack.state = state;
	};
	
	/*
	 *	Listener for broadcast from service stating the end of a video
	 *	Pops a video off the top of the playlist and plays the next video
	 */
	$scope.$on('eventVideoEnd', function(event, data) {
        console.log("Video ended");
		$scope.removeTrack(data.currentVideo.id);
		$scope.updateCurrentTrack('','','','stopped');
		if (playlist.length > 0)
			$scope.playTrack(playlist[0].id, playlist[0].title, playlist[0].type);
		else
			YouTubeService.hidePlayer();
    });
	
	/*
	 *	Listener for broadcast from service stating the video has been paused
	 *	Just updates the state
	 */
	$scope.$on('eventVideoPause', function(event, data) {
        console.log("Video paused");
		$scope.updateCurrentState('paused');
    });
	
	/*
	 *	Listener for broadcast from service stating the video has been started
	 *	Just updates the state
	 */
	$scope.$on('eventVideoPlay', function(event, data) {
        console.log("Video playing");
		$scope.updateCurrentState('playing');
    });
	
	/*
	 *	Listener for broadcast from service stating the video has been cued
	 *	Just updates the state
	 */
	$scope.$on('eventVideoCue', function(event, data) {
        console.log("Video cued");
		$scope.updateCurrentState('stopped');
    });
	
});