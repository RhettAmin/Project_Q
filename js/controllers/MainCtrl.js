app.controller('MainCtrl', function ($scope, $http, YouTubeService, SoundCloudService) {
	
	/*
	 *	search()
	 *	For Searching tracks
	 */
	$scope.search = function (type) {
		
		console.log("Search of type: "+type);
		if (type === "youtube" ) {					// -- If searching for Youtube
			
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
				$scope.results = YouTubeService.listResults(data);	// Parse and list the results
			})
			.error( function (err) {
				console.log(err);
			});
			
		} else if (type === "soundcloud") {			// -- If searching for Soundcloud
			
			SC.get('/tracks', {
				q: this.query
			})
			.then( function (data) {
				console.log(data);
				$scope.results = SoundCloudService.listResults(data);	// Parse and list the results
				$scope.$apply();	// Without this the search takes 2 button presses since SC works differently than $http
			});
			
		}
    };
	
	/*
	 *	addTrack(id, title, type)
	 *	Adds a track to the playlist
	 */
	$scope.addTrack = function (id, title, type) {
		
		// Add the track to the playlist
		playlist.push({
			id:id,
			title:title,
			votes:0,
			type:type
		});
		console.log('Adding track of type: '+type);
		
		// TODO: Visual feedback showing added to playlist will go here
		
		if (playlist.length == 1) {				// Start playing if its the only video in the list
			$scope.playTrack(playlist[0].id, playlist[0].title, type);
		}
		$scope.updatePlaylist(playlist);		// Set playlist variable in YT service
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
		else if (type === "soundcloud") {
			SoundCloudService.launchPlayer(id, title);
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
		
		$scope.updatePlaylist(playlist);
		$scope.playHistory = playHistory;
		
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
		
		$scope.updatePlaylist(playlist);
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
		
		$scope.updatePlaylist(playlist);
	};
	
	/*
	 * updatePlaylist(playlist)
	 * Sends out updates to scope and each service to keep their playlists synchronized
	 */
	$scope.updatePlaylist = function (playlist) {
		$scope.playlist = playlist;					// Set playlist variable in scope for html
		YouTubeService.setPlaylist(playlist);		// Set playlist variable in YouTube service
		//SoundCloudService.setPlaylist(playlist);	// Set playlist variable in SoundCloud service
	}
	
	/*
	 *	updateCurrentTrack(id, title, type)
	 *	Updates the current track values in each service and main scope
	 */
	$scope.updateCurrentTrack = function (id, title, type, state) {
		$scope.currentTrack = { id:id, title:title, type:type, state:state };
		YouTubeService.setCurrentVideo(id, title);
		//SoundCloudService.setCurrentVideo(playlist);
	};
	
	/*
	 *	updateCurrentState(state)
	 *	Updates the current track's state (playing, stopped, or paused)
	 */
	$scope.updateCurrentState = function (state) {
		$scope.currentTrack.state = state;
	};
	
	/****** Event listeners ******/
	
	/** YouTube Event Listeners **/
	
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
	
	/*
	 *	Listener for broadcast from service stating services are ready for use
	 *	Enables the search box
	 */
	$scope.$on('eventYTServiceReady', function(event, data) {
        //console.log("All services ready");
		document.getElementById('query').removeAttribute('disabled');
		document.getElementById('submit').removeAttribute('disabled');
		document.getElementById('query').setAttribute('placeholder','Search for a track');
    });
	
	/** SoundCloud Event Listeners **/
	
	/*
	 *	Listener for broadcast from service stating that the player is ready
	 *	
	 */
	$scope.$on('eventSCReady', function(event, data) {
        console.log("SC Ready");
		//console.log(data);
    });
	
	/*
	 *	Listener for broadcast from service stating that the player is ready
	 *	
	 */
	$scope.$on('eventSCPlaying', function(event, data) {
        console.log("SC Playing");
		//console.log(data);
    });
	
	/*
	 *	Listener for broadcast from service stating that the player is ready
	 *	
	 */
	$scope.$on('eventSCPaused', function(event, data) {
        console.log("SC Paused");
		//console.log(data);
    });
	
	/*
	 *	Listener for broadcast from service stating that the player is ready
	 *	
	 */
	$scope.$on('eventSCFinished', function(event, data) {
        console.log("SC Finished");
		//console.log(data);
    });
	
	
});