app.controller('YouTubeController', function ($scope, $http, YouTubeService) {
		
	$scope.search = function () {
		$http.get('https://www.googleapis.com/youtube/v3/search', {
			params: {
				key: 'AIzaSyC4yvdM2ovZJfXdOnWlgbDQGbAK0dD1te0',
				type: 'video',
				maxResults: '8',
				part: 'id,snippet',
				fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
				q: this.query
			}
		})
		.success( function (data) {
			$scope.results = YouTubeService.listResults(data);
			console.log(data);
		})
		.error( function (err) {
			console.log(err);
		});
    }
	
	// Add a video to the playlist
	$scope.addVideo = function (id, title) {
		console.log(title+","+id);
		playlist.push({id:id,title:title});
		// ** Visual feedback showing added to playlist will go here **
		
		if (playlist.length == 1) {
			$scope.playVideo(playlist[0].id, playlist[0].title);
		}
		$scope.playlist = playlist;
		YouTubeService.setPlaylist(playlist);
    }
	
	// Play a video
	$scope.playVideo = function (id, title) {
		YouTubeService.launchPlayer(id, title);
		//YouTubeService.archiveVideo(id, title);
		//YouTubeService.deleteVideo($scope.upcoming, id);
    };
	
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
	}
	
	// Recieved broadcast from service stating end of video
	$scope.$on('eventVideoEnd', function(event, data) {
        console.log("video ended");
		$scope.removeVideo(data.currentVideo.videoId);
		if (playlist.length > 0)
			$scope.playVideo(playlist[0].id, playlist[0].title);
    });
	
	
});