function Photo(rawPhoto) {

	// ensure that new has been used
	if (!(this instanceof Photo)) {
		console.log('Photo not called with new!');
		return new Photo(rawPhoto);
	}
	
	// declare variables
	var _formattedSize = FLICKR.getPhotoSize(settings.photoSize),
		_thumbSize = FLICKR.getPhotoSize(settings.photoThumbSize);
		
	// define variables
	this.raw = 			rawPhoto;
	this.tags =			rawPhoto.info.photo.tags.tag._content 			||	undefined;
	this.title =		rawPhoto.title									||	undefined;
	this.description =	rawPhoto.info.photo.description._content 		||	undefined;
	this.taken =		rawPhoto.info.photo.dates.taken					||	undefined;
	this.latitude = 	undefined;
	this.longitude = 	undefined;
	this.locality =		undefined;
	this.county =		undefined;
	this.region =		undefined;
	this.url =			'http://farm' + rawPhoto.farm + '.static.flickr.com/' + rawPhoto.server + '/' + rawPhoto.id + '_' + rawPhoto.secret + _formattedSize || 'http://www.placeholder-image.com/image.jpg';
	this.urlThumb = 	'http://farm' + rawPhoto.farm + '.static.flickr.com/' + rawPhoto.server + '/' + rawPhoto.id + '_' + rawPhoto.secret + _thumbSize || 'http://www.placeholder-image.com/image.jpg';
	
	// if we have location data, override defaults
	if ('location' in rawPhoto.info.photo) {
		this.latitude = 	rawPhoto.info.photo.location.latitude;
		this.longitude = 	rawPhoto.info.photo.location.longitude;
		this.locality =		rawPhoto.info.photo.location.locality._content;
		this.county =		rawPhoto.info.photo.location.county._content;
		this.region =		rawPhoto.info.photo.location.region._content;
	}	
		
	return this;
}