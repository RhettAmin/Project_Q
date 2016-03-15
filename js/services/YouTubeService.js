app.service('YouTubeService', function () {
	
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
	}
	
});