var GOOGLE = (function () {

	var myOptions = {
			zoom: 2,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			panControl: true,
			navigationControl:true,
			streetViewControl: false,
			navigationControlOptions: {
				style:google.maps.NavigationControlStyle.LARGE
			},
			mapTypeControl:false,
			mapTypeControlOptions: {
				style:google.maps.MapTypeControlStyle.DEFAULT
			}
		},
		map = new google.maps.Map(document.getElementById("map"), myOptions),
		geoSupport = new Boolean(),
		wholeUK = new google.maps.LatLng(54.533833, -3.955078),
		infowindow = new google.maps.InfoWindow({
			maxWidth: 200,
			borderColor: '#990000'
		}),
		userFoundContentString = "You're here *<br /><span style='font-size:10px; font-weight:normal; font-style:italic; color:#4c4c4c; '>* Well, according to your browser anyway.</span>",
		userInfowindow = new google.maps.InfoWindow({
			content: "<div class='infowin'><h3 style='line-height:22px'>" + userFoundContentString + "</h3></div>",
			maxWidth: 300
		}),
		markerCollection = [],
		userMarker,
		photoMarker = 'img/dot.png',
		photoMarkerActive = 'img/dot_splat.png',
		markerCurrent = undefined;
		
		google.maps.event.addListener(map, 'tilesloaded', mapLoaded);
		google.maps.event.addListener(infowindow, 'closeclick', closeMarker);
		
	/*********************************
		expected input parameter is an array of photos
	*********************************/	
	function drawMap(photos) {
		console.log('Drawing Map...with ' + photos.length + ' photos');
		
		var geoSupportFlag = new Boolean(),
			photoCount = photos.length,
			scrollerHTML = '';
		
		// Try W3C Geolocation method (Preferred)
		if (navigator.geolocation) {
			// browser claims to support Geolocation
			console.log('browser claims to support geo location');
			geoSupportFlag = true;
			navigator.geolocation.getCurrentPosition(function(position) {

				var userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
				//var userLocation = new google.maps.LatLng(60, 105), /* put userLocation in Siberia */
					userHomeicon = 'img/user_dot.png',
					i = 0,
					photoLocation,
					photoTitle,
					photoThumbURL,
					marker,
					bounds = new google.maps.LatLngBounds();					

				userMarker = new google.maps.Marker({
					position: userLocation,
					map: map,
					icon: userHomeicon
				});
				userMarker.setAnimation(google.maps.Animation.DROP);
				
				// add the users location to the bounds object
				bounds.extend(userLocation);
				
				google.maps.event.addListener(userMarker, 'click', function() {					
					userInfowindow.open(map, userMarker);
				});
				
				
				
				
				// START CONSTRUCTING scrollerHTML
				scrollerHTML += '<div class="items"><div>\r';
				
				$.each(photos, function(i, photo) {
					var photoLocation = new google.maps.LatLng(photo.latitude, photo.longitude),
						photoTitle = photo.title,
						photoThumbURL = photo.urlThumb;
					
					// add each photos bound data to the bounds object
					bounds.extend(photoLocation);
					map.fitBounds(bounds);
					//console.log('4');
					
					// create a marker for each photo
					markerCollection[i] = new google.maps.Marker({
						position: photoLocation,
						map: map,
						title: photoTitle,
						icon: photoMarker
					});
					// set the markers animation type
					markerCollection[i].setAnimation(google.maps.Animation.DROP);
					
					// set the click event
					google.maps.event.addListener(markerCollection[i], 'click', function(e) {
						markerClickHandler(photoTitle, photoThumbURL, this);
					});
					
					// ADD singular item to scrollerHTML
					buildScrollerItem(i, photoThumbURL);						
				});		
				
				// END CONSTRUCTING scrollerHTML
				scrollerHTML += '</div></div>';
				
				// insert into DOM and make it scrollable
				$('#scrollable').append(scrollerHTML);				
				drawScroller();
				
			},
			function() {
				// browser claims to support Geolocation but something went wrong
				noGeolocation(geoSupportFlag);
			});
		}
		else {
			// browser simply doesn't support Geolocation
			geoSupportFlag = false;
			noGeolocation(geoSupportFlag);
		}
		
		function buildScrollerItem(i, photoURL) {			
			if (((i % 7) === 0) && (i > 0)) {
				// create new div group
				scrollerHTML += '</div>\r<div>\r<img src="' + photoURL + '" id="scrollable-thumb-' + i + '" />\r';
			} else {
				// keep building existing div group
				scrollerHTML += '<img src="' + photoURL + '" id="scrollable-thumb-' + i + '" />\r';
			}	
		}		
	}	
	
	function noGeolocation(errorFlag) {
		
		if (errorFlag == true) {
			contentString = "Ooops. The Geolocation service failed.";
		}
		else {
			contentString = "Error: Your browser doesn't support geolocation.";
		}
		map.setCenter(wholeUK);
		infowindow.setContent(contentString);
		infowindow.setPosition(wholeUK);
		infowindow.open(map);
	}

	function mapLoaded() {
		var i,
			len = markerCollection.length;	
			
		$('#loading, #flickr-loader').animate({'opacity' : '0'}, 500, function() {
			$(this).empty().remove();
			userMarker.setMap(map);
		
			for (i = 0; i < len; i++) {
				markerCollection[i].setMap(map);
			}
		});	
	}
	
	function drawScroller() {	
		var i,
			len = HARVESTPHOTOS.photos.length,
			currentPhotoLocation;
		
		for (i = 0; i < len; i++) {			
			currentPhotoLocation = new google.maps.LatLng(HARVESTPHOTOS.photos[i].latitude, HARVESTPHOTOS.photos[i].longitude);	
			$('#scrollable img#scrollable-thumb-' + i).bind('click', {loc:currentPhotoLocation, scrollableThumbID:i}, thumbClickHandler);			
		}
	
		// custom easing called "custom"
		$.easing.custom = function (x, t, b, c, d) {
			var s = 1.70158; 
			if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		}
		
		$("#scrollable").scrollable({easing: 'custom', speed: 700, circular: false});
	}
	
	function thumbClickHandler(e) {
		// open respective map marker	
		markerClickHandler(HARVESTPHOTOS.photos[e.data.scrollableThumbID].title, HARVESTPHOTOS.photos[e.data.scrollableThumbID].urlThumb, markerCollection[e.data.scrollableThumbID]);
		map.panTo(e.data.loc);						
	}
	
	function markerClickHandler(photoTitle, photoThumbURL, currentMarker) {
		if (markerCurrent !== undefined) {
			markerCurrent.setIcon(photoMarker);
		}
		currentMarker.setIcon(photoMarkerActive);
		markerCurrent = currentMarker;
		infowindow.setContent("<div class='infowin'><h3>" + photoTitle + "</h3>" + "<img src='" + photoThumbURL + "' /></div>");
		infowindow.open(map, currentMarker);		
	}
	
	function closeMarker() {
		console.log('called closeMarker');
		markerCurrent.setIcon(photoMarker);
	}
	
	return {
		drawMap : drawMap
	};


})();