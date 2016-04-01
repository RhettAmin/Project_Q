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
		console.log('Adding <'+type+'> track: '+title);
		
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
		if (type === "youtube")
			YouTubeService.launchPlayer(id, title);
		else if (type === "soundcloud")
			SoundCloudService.launchPlayer(id, title);
		$scope.updateCurrentTrack(id, title, type, 'playing');
    };
	
	/*
	 *	removeTrack(id)
	 *	Removes a video from the playlist and adds it to the play history
	 */
	$scope.removeTrack = function (id, type) {
		for (var i=0; i<playlist.length; i++) {
			if (playlist[i].id === id) {
				playHistory.push({id:playlist[i].id,title:playlist[i].title,type:playlist[i].type});
				playlist.splice(i,1);
				break;
			}
		}
		
		$scope.updatePlaylist(playlist);
		$scope.playHistory = playHistory;
		
		var currentVidId = $scope.currentTrack.id;
		console.log($scope.currentTrack.title);
		
		YouTubeService.stopVideo();				//  Stop Video
		SoundCloudService.pauseTrack();			//	Stop Track
		if (currentVidId === id)				// If currently playing video deleted 
			$scope.playTrack(playlist[0].id, playlist[0].title, playlist[0].type); // Play next video
		
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
	}
	
	/*
	 *	updateCurrentTrack(id, title, type)
	 *	Updates the current track values in each service and main scope
	 */
	$scope.updateCurrentTrack = function (id, title, type, state) {
		$scope.currentTrack = { id:id, title:title, type:type, state:state };
	};
	
	/*
	 *	updateCurrentState(state)
	 *	Updates the current track's state (playing, stopped, or paused)
	 */
	$scope.updateCurrentState = function (state) {
		$scope.currentTrack.state = state;
	};
	
	/*
	 *	btnPlay()
	 *	Button function that plays the song
	 */
	$scope.btnPlay = function () {
		var type = $scope.currentTrack.type;
		if (type === "youtube") {
			YouTubeService.playVideo();
		} 
		else if (type === "soundcloud") {
			SoundCloudService.playTrack();
		}
	}
	
	/*
	 *	btnPause()
	 *	Button function that pauses the song
	 */
	$scope.btnPause = function () {
		var type = $scope.currentTrack.type;
		if (type === "youtube") {
			YouTubeService.pauseVideo();
		} 
		else if (type === "soundcloud") {
			SoundCloudService.pauseTrack();
		}
	}
	
	/*
	 *	btnNext()
	 *	Button function that goes to the next song
	 */
	$scope.btnNext = function () {
		$scope.removeTrack($scope.currentTrack.id);
	}
	
	
	/****** Event listeners ******/
	
	/*
	 *	Listener for broadcast from service stating the end of a track
	 *	Pops a track off the top of the playlist and plays the next track
	 */
	$scope.$on('eventYTFinish', function(event, data) {
		console.log("YOUTUBE finish");
        $scope.trackFinished();
    });
	
	/*
	 *	Listener for broadcast from service stating the end of a track
	 *	Pops a track off the top of the playlist and plays the next track
	 */
	$scope.$on('eventSCFinish', function(event, data) {
		console.log("SOUNDCLOUD finish");
        $scope.trackFinished();
    });
	
	/*
	 *	trackFinished()
	 *	Called when track finished
	 */
	$scope.trackFinished = function () {
		//console.log("Track ended");
		$scope.removeTrack($scope.currentTrack.id);
		if (playlist.length > 0) {
			console.log(playlist[0].title);
			$scope.playTrack(playlist[0].id, playlist[0].title, playlist[0].type);
		}
		else
			$scope.updateCurrentTrack('','','','stopped');
	}
	
	/*
	 *	Listener for broadcast from service stating services are ready for use
	 *	Enables the search box
	 */
	$scope.$on('eventYTServiceReady', function(event, data) {
		document.getElementById('query').removeAttribute('disabled');
		document.getElementById('submit').removeAttribute('disabled');
		document.getElementById('query').setAttribute('placeholder','Search for a track');
    });
	
	
});