// create our photo settings object 
var settings = {
	provider 		: 0,
	apiKey 			: '634562c3512132b584e66ff22d4c5288',
	userID 			: '39569477@N05',
	photoSize 		: 'm',
	photoThumbSize	: 't'
};

// start the async JSON request
HARVESTPHOTOS.preFetch(settings);

// document ready
$(function () {
	
	// loading set-up
	
	
	// make sure that the flickr photo collection is ready before starting
	(function isReady() {
		if (HARVESTPHOTOS.isReady === true) {
			GOOGLE.drawMap(HARVESTPHOTOS.photos);
		} else {
			console.log('waiting for JSON....')
			setTimeout(isReady, 500);
		}
	} ());
});  