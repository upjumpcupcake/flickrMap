var HARVESTPHOTOS = (function () {
	
	var isReady = false,
		photos = [];
	
	/*********************************
	settings argument is an object, eg:
		var settings = {
			provider 	: 0,
			apiKey		: '634562c3512132b584e66ff22d4c5288',
			userID		: '39569477@N05',
			photoSize 	: 'm'
		};
	*********************************/
	function getPhotos(settings) {
		var provider = settings.provider;
		
		// 0 = flickr 
		// 1 = facebook 
		// 2 = tumblr 
		// 3 = picasa
		
		switch (provider) {
		case(0):
			FLICKR.getPhotos(settings);
			break;
		case(1):
			// do facebook function
			break;
		case(2):
			// do tumblr function
			break;
		case(3):
			// do picasa function
			break;	
		default:
			// do flickr function
		}
	}
	
	function setPhotoCollection(photoCollection) {
		HARVESTPHOTOS.photos = photoCollection;
		HARVESTPHOTOS.isReady = true;
	}
		
	return {
		preFetch : getPhotos,
		isReady : isReady,
		photos : photos,
		jsonReady : setPhotoCollection
	};

})();


