app.controller('MainCtrl', function ($scope, $http, YouTubeService, SoundCloudService) {
	
	$scope.results = [];		// each item: { id, title, description, thumbnail, author, duration }
	$scope.playlist = [];		// each item: { id, title, votes, type, duration }
	$scope.playHistory = [];	// each item: { id, title, type, duration }
	$scope.currentTrack;		// singular:  { id, title, type, state, time, duration }
	
	
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
				data = $scope.getYTVideoDurations(data); // Will also handle YouTubeService.listResults(data)
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
	 * 	getYTVideoDurations(data)
	 *	>> Assists the YouTube portion of search() function above
	 *	YouTube's search API won't return durations of videos so make another call with video IDs to the video API
	 */
	$scope.getYTVideoDurations = function (data) {
		var ids = "";
		for (var i=0; i<data.items.length; i++) {	// Compile comma seperated list of ids for query
			ids = ids + data.items[i].id.videoId + ",";
		}
		ids = ids.slice(0, -1);	// Chop off last comma
		$http.get('https://www.googleapis.com/youtube/v3/videos', {
			params: {
				key: 'AIzaSyC4yvdM2ovZJfXdOnWlgbDQGbAK0dD1te0',
				part: 'contentDetails',
				id: ids
			}
		})
		.success( function (data2) {		// On success
			// Now we append each duration to the initial data set
			for (var i=0; i<data.items.length; i++) {
				for (var j=0; j<data2.items.length; j++) {
					if (data.items[i].id.videoId == data2.items[j].id) {
						var formattedTime = convertISO8601ToSeconds(data2.items[j].contentDetails.duration);
						data.items[i]['duration'] = formattedTime;
						break;
					}
				}
			}
			$scope.results = YouTubeService.listResults(data);	// Parse and list the results
		})
		.error( function (err) {
			console.log(err);
		});
		
	}
	
	/*
	 *	convertISO8601ToSeconds(input)
	 *	Converts YouTube's ISO-8601 time format into seconds
	 */
	function convertISO8601ToSeconds(input) {
		var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
		var hours = 0, minutes = 0, seconds = 0, totalseconds;

		if (reptms.test(input)) {
			var matches = reptms.exec(input);
			if (matches[1]) hours = Number(matches[1]);
			if (matches[2]) minutes = Number(matches[2]);
			if (matches[3]) seconds = Number(matches[3]);
			totalseconds = hours * 3600  + minutes * 60 + seconds;
			return totalseconds;
		}
	}
	
	/*
	 *	addTrack(id, title, type)
	 *	Adds a track to the playlist
	 */
	$scope.addTrack = function (id, title, type, duration) {
		
		// Add the track to the playlist
		$scope.playlist.push({
			id:id,
			title:title,
			votes:0,
			type:type,
			duration:duration
		});
		
		// TODO: Visual feedback showing added to playlist will go here
		
		if ($scope.playlist.length == 1) {				// Start playing if its the only video in the list
			$scope.playTrack($scope.playlist[0].id, $scope.playlist[0].title, type, $scope.playlist[0].duration);
		}
		//$scope.updatePlaylist(playlist);		// Set playlist variable in YT service
    };
	
	/*
	 *	playTrack(id, title, type)
	 *	Plays a video in the YouTube player
	 */
	$scope.playTrack = function (id, title, type, duration) {
		YouTubeService.stopVideo();				//  Stop Video
		SoundCloudService.pauseTrack();			//	Stop Track
		
		if (type === "youtube")
			YouTubeService.launchPlayer(id, title);
		else if (type === "soundcloud")
			SoundCloudService.launchPlayer(id, title);
		$scope.updateCurrentTrack(id, title, type, 'playing', 0, duration);
    };
	
	/*
	 *	removeTrack(id)
	 *	Removes a video from the playlist and adds it to the play history
	 */
	$scope.removeTrack = function (id, type) {
		for (var i=0; i<$scope.playlist.length; i++) {
			if ($scope.playlist[i].id === id) {
				$scope.playHistory.push({
					id: $scope.playlist[i].id,
					title: $scope.playlist[i].title,
					type: $scope.playlist[i].type,
					duration: $scope.playlist[i].duration
				});
				$scope.playlist.splice(i,1);
				break;
			}
		}
		
		var currentVidId = $scope.currentTrack.id;
		console.log($scope.currentTrack.title);
		
		if (currentVidId === id && $scope.playlist.length > 0)	 // If currently playing video deleted
			$scope.playTrack($scope.playlist[0].id, $scope.playlist[0].title, $scope.playlist[0].type, $scope.playlist[0].duration); // Play next video
		if ($scope.playlist.length <= 0) {
			YouTubeService.stopVideo();				//  Stop Video
			SoundCloudService.pauseTrack();			//	Stop Track
		}
		
	};
	
	/*
	 *	upvote(id)
	 *	Upvotes an item in the playlist
	 */
	$scope.upvote = function (id) {
		for (var i=0; i<$scope.playlist.length; i++) {
			if ($scope.playlist[i].id === id) {
				$scope.playlist[i].votes += 1;
				break;
			}
		}
		
		//$scope.updatePlaylist(playlist);
	};
	
	/*
	 *	downvote(id)
	 *	Downvotes an item in the playlist
	 */
	$scope.downvote = function (id) {
		for (var i=0; i<$scope.playlist.length; i++) {
			if ($scope.playlist[i].id === id) {
				$scope.playlist[i].votes -= 1;
				break;
			}
		}
		
		//$scope.updatePlaylist(playlist);
	};
	
	/*
	 * updatePlaylist(playlist)
	 * Sends out updates to scope and each service to keep their playlists synchronized
	 */
	$scope.updatePlaylist = function (playlist) {
		//$scope.playlist = playlist;					// Set playlist variable in scope for html
	}
	
	/*
	 *	updateCurrentTrack(id, title, type)
	 *	Updates the current track values in each service and main scope
	 */
	$scope.updateCurrentTrack = function (id, title, type, state, time, duration) {
		$scope.currentTrack = { id:id, title:title, type:type, state:state, time:time, duration:duration };
	};
	
	/*
	 *	updateCurrentState(state)
	 *	Updates the current track's state (playing, stopped, or paused)
	 */
	$scope.updateCurrentState = function (state) {
		$scope.currentTrack.state = state;
	};
	
	/*
	 *	updateCurrentTime(time)
	 *	Updates the current track's position
	 */
	 $scope.updateCurrentTime = function (time) {
		$scope.currentTrack.time = time;
		$scope.$apply();
	 }
	
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
		$scope.updateCurrentState('playing');
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
		$scope.updateCurrentState('paused');
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
		console.log("YouTube track finished");
        $scope.trackFinished();
    });
	
	/*
	 *	Listener for broadcast from service stating the end of a track
	 *	Pops a track off the top of the playlist and plays the next track
	 */
	$scope.$on('eventSCFinish', function(event, data) {
		console.log("SoundCloud track finished");
        $scope.trackFinished();
    });
	
	/*
	 *	trackFinished()
	 *	Called when track finished
	 */
	$scope.trackFinished = function () {
		$scope.removeTrack($scope.currentTrack.id);
		if ($scope.playlist.length > 0) {
			console.log($scope.playlist[0].title + " finished playing.");
			$scope.playTrack($scope.playlist[0].id, $scope.playlist[0].title, $scope.playlist[0].type, $scope.playlist[0].duration);
		}
		else
			$scope.updateCurrentTrack('','','','stopped',0,0);
	};
	
	/*
	 *	Listener for broadcast from service stating services are ready for use
	 *	Enables the search box
	 */
	$scope.$on('eventYTServiceReady', function(event, data) {
		document.getElementById('query').removeAttribute('disabled');
		document.getElementById('submit').removeAttribute('disabled');
		document.getElementById('query').setAttribute('placeholder','Search for a track');
    });
	
	
	$scope.$on('eventPlaying', function (event, data) {
		//console.log(data.time);
	});
	
	$scope.$on('eventTime', function (event, data) {
		//console.log(data.time);
		$scope.updateCurrentTime(data.time);
	});
	
});