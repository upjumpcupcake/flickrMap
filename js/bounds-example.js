function initialize() {
	var myOptions = {
		zoom: 10,
		center: new google.maps.LatLng(0, 0),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	
	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	setMarkers(map, beaches);
}

var beaches = [
  ['Bondi Beach', -33.890542, 151.274856, 4],
  ['Coogee Beach', -33.923036, 161.259052, 5],
  ['Cronulla Beach', -36.028249, 153.157507, 3],
  ['Manly Beach', -31.80010128657071, 151.38747820854187, 2],
  ['Maroubra Beach', -33.950198, 151.159302, 1]
];

function setMarkers(map, locations) {
    var image = new google.maps.MarkerImage('images/beachflag.png',
		new google.maps.Size(20, 32),
		new google.maps.Point(0,0),
		new google.maps.Point(0, 32));
	var shadow = new google.maps.MarkerImage('images/beachflag_shadow.png',
		new google.maps.Size(37, 32),
		new google.maps.Point(0,0),
		new google.maps.Point(0, 32));
	var shape = {
		coord: [1, 1, 1, 20, 18, 20, 18 , 1],
		type: 'poly'};
		
	var bounds = new google.maps.LatLngBounds();
	
	for (var i = 0; i < locations.length; i++) {
		var beach = locations[i];
		var myLatLng = new google.maps.LatLng(beach[1], beach[2]);
		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			shadow: shadow,
			icon: image,
			shape: shape,
			title: beach[0],
			zIndex: beach[3]
		});
		bounds.extend(myLatLng);
		map.fitBounds(bounds);
	}
}
