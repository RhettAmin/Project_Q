app.controller('YouTubeController', function ($scope, $http, YouTubeService) {
	
	var control = this;	// "Pointer" to this controller for use in functions with new scope
	
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
	
	$scope.addVideo = function (id, title) {
		console.log(title+","+id);
		playlist.push({id:id,title:title});
		// ** Visual feedback showing added to playlist will go here **
		
		if (playlist.length == 1) {
			$scope.playVideo(playlist[0].id, playlist[0].title);
		}
		$scope.playlist = playlist;
    }
	
	$scope.playVideo = function (id, title) {
		YouTubeService.launchPlayer(id, title);
		//YouTubeService.archiveVideo(id, title);
		//YouTubeService.deleteVideo($scope.upcoming, id);
    };
	
	
});