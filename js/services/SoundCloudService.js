app.service('SoundCloudService', ['$window', '$rootScope', function ($window, $rootScope) {
	
	var service = this;		// "Pointer" to this service for use in functions with new scope
	
	/*
	 *	listResults(data)
	 *	Parses the data from a SoundCloud search and returns a dictionary with
	 *	{id, title, description, thumbnail, author}
	 */
	this.listResults = function (data) {
		results.length = 0;
		for (var i=0; i<data.length; i++) {
			results.push( {
				id: data[i].id,
				title: data[i].title,
				description: data[i].description,
				thumbnail: data[i].artwork_url,
				author: data[i].username
			});
		}
		return results;
	};
	
}]);