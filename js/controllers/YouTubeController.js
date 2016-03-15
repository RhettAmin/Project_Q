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
	
});