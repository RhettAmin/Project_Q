/**
 * Service: Youtube Search Service
 */
function ytSearch($http) {
	
	var ytSearch = this;
	
	this.parseResultData = function (data) {
		results = [];
		for (var i = data.items.length - 1; i >= 0; i--) {
		  results.push( data.items[i] );
		}
		return results;
	}
	
	this.search = {
		async: function() {
			return $http.get('https://www.googleapis.com/youtube/v3/search', {
				params: {
					key: 'AIzaSyC4yvdM2ovZJfXdOnWlgbDQGbAK0dD1te0',
					type: 'video',
					maxResults: '8',
					part: 'id,snippet',
					fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
					q: this.query
				}
			})
		}
	};
	
}


angular.module('QueueApp')
.service('ytSearch', ytSearch);