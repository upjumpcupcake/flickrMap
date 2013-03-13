var FLICKRMAP = (function () {

	// flickr will hold our amalgamated flickr data
	var flickrPrefix = 'http://api.flickr.com/services/rest/?&method=',
		flickrResponseSuffix = '&format=json&jsoncallback=?';
		flickr = {
			isReady: false,
			photoCollection:{}
		};	
	
	/*********************************
	settings argument is an object, eg:
		var settings = {
			apiKey:'634562c3512132b584e66ff22d4c5288',
			userID:'39569477@N05',
			photoSize : 'm'
		};
	*********************************/
	function getAllPhotos(settings) {
		// build flickr.people.getPublicPhotos url
		var getPublicPhotosMethod = flickrPrefix + 'flickr.people.getPublicPhotos&api_key=' + settings.apiKey + '&user_id=' + settings.userID + flickrResponseSuffix,
			formattedSize = returnPhotoSize(settings.photoSize);
		
		// build initial JSON request to get latest PUBLIC photos
		$.getJSON(getPublicPhotosMethod, function(data){
			
			// assign resultant JSON to the flickr object
			flickr.photoCollection = data;
			
			// loop through the JSON results to create each photo's URL
            $.each(flickr.photoCollection.photos.photo, function(i, photo){
				flickr.photoCollection.photos.photo[i].url = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + formattedSize;
				
				// build flickr.photos.getInfo url (which very fortunately contains geotagging info if available, therefore no need to call subsequent photo.getLocation method afterwards)
				var getInfoMethod = flickrPrefix + 'flickr.photos.getInfo&api_key=' + settings.apiKey + '&photo_id=' + photo.id + flickrResponseSuffix;
				
				// use an ajax request to get the info for the photo incl. geoLocation info
				$.getJSON(getInfoMethod, function(data){
				
					// check that data was returned
					if (data.stat != 'fail') {
						// if the photo has a location then add it as a SIBLING to info in the object ************* NOTE this will add duplicate location entries, how to stop?
						if (data.photo.hasOwnProperty('location')) {
							console.log('location found!')
							flickr.photoCollection.photos.photo[i].location = data.photo.location;
						} else {
							console.log('location not found!')
							flickr.photoCollection.photos.photo[i].location = undefined;
						}
						flickr.photoCollection.photos.photo[i].info = data.photo;
					} else {
						flickr.photoCollection.photos.photo[i].info = data.message;
					}
					
				});			
			});
			
			// now set the ready flag
			flickr.isReady = true;
			
		});
		
	}
	
	function returnPhotoSize(suffix) {
			
		// s small square 75x75 
		// t thumbnail, 100 on longest side 
		// m small, 240 on longest side 
		// - medium, 500 on longest side 
		// z medium 640, 640 on longest side 
		// b large, 1024 on longest side* 
		// o original image, either a jpg, gif or png, depending on source format - must be a PRO account though
		
		var size = suffix,
			format = '.jpg';

		switch (size) {
		case('s'):
			size = '_s' + format;
			break;
		case('t'):
			size = '_t' + format;
			break;
		case('m'):
			size = '_m' + format;
			break;
		case('-'):
			size = '_-' + format;
			break;
		case('z'):
			size = '_z' + format;
			break;
		case('b'):
			size = '_b' + format;
			break;
		case('o'):
			size = '_o' + format;
			break;
		default:
			size = '_m' + format;
		}
		return size;
	};
	
	function log(){
		console.log(flickr.isReady, flickr);
	};
	
	return {
		flickr : flickr,
		preFetch : getAllPhotos,
		go : log		
	};

})();

// create our settings object 
var settings = {
	apiKey:'634562c3512132b584e66ff22d4c5288',
	userID:'39569477@N05',
	photoSize : 'm'
};

// start the async JSON request
FLICKRMAP.preFetch(settings);

// document ready
$(function () {
	
	// make sure that the flickr{} is ready before starting
	(function isReady() {
		if (FLICKRMAP.flickr.isReady === true) {
			FLICKRMAP.go();
		} else {
			console.log('waiting for JSON....')
			setTimeout(isReady, 500);
		}
	} ());
});    

// TO DO...create a photo class/constructor

