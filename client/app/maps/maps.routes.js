'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('maps', {
      url: '/maps',
      template: '<maps></maps>'
    });
}
/**
 *
 <script type="text/javascript"
       src="http://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyDG7zdTe4gtpB9w5bAhg5uPQAqzf4z1cjc">
       */
var map;
var landingPoly;
var maxZoomService;


var LandingCoords = [];
var markers = [];

function initialize() {

    var markers = [];

    maxZoomService = new google.maps.MaxZoomService();

    var myLatlng = new google.maps.LatLng(51.649266, 5.359901);
    var mapOptions = {
        center : myLatlng,
        mapTypeId : google.maps.MapTypeId.HYBRID,
        disableDefaultUI : true,
        zoomControl : true,
        zoomControlOptions : {
            style : google.maps.ZoomControlStyle.SMALL,
            position : google.maps.ControlPosition.TOP_RIGHT,
        },
        zoom : 20,

    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    google.maps.event.addDomListener(map, 'click', addMarker);

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(input);

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {

        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        for ( var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }

        // For each place, get the icon, place name, and location.
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for ( var i = 0, place; place = places[i]; i++) {
            var image = {
                url : place.icon,
                size : new google.maps.Size(71, 71),
                origin : new google.maps.Point(0, 0),
                anchor : new google.maps.Point(17, 34),
                scaledSize : new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map : map,
                icon : image,
                title : place.name,
                position : place.geometry.location
            });

            markers.push(marker);

            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);

    });
    // [END region_getplaces]
    //this.addLanding();


}

function drawLanding() {


    var centerlat =0;
    var centerlon =0;

    for (i = 0; i < LandingCoords.length; i++) {
    	centerlat +=LandingCoords[i].lat();
    	centerlon +=LandingCoords[i].lng();
	}
    landingPoly = new google.maps.Polygon({
        paths : LandingCoords,
        strokeColor : '#00FF00',
        strokeOpacity : 0.8,
        strokeWeight : 2,
        fillColor : '#00FF00',
        fillOpacity : 0.35
    });
    landingPoly.setMap(map);

    centerUpdate(centerlat/4,centerlon/4);

}

function centerUpdate(lat, lng) {


	newlat = new google.maps.LatLng(lat,lng);

    //maxZoomService.getMaxZoomAtLatLng(newlat, setZoomtoMax);

    map.setCenter(newlat);
}

function setZoomtoMax(response) {

    if (response.status != google.maps.MaxZoomStatus.OK) {
        alert('Error in MaxZoomService');
        return;
    } else {

        map.setZoom(response.zoom);
    }
}

function addLandingCoord(lat,lng) {

	if(LandingCoords.length == 4) {
		deleteLanding();
	}

	LandingCoords.push(new google.maps.LatLng(lat,lng));
	if(LandingCoords.length == 4) {
		drawLanding();
	}
}

function deleteLanding() {
	LandingCoords = [];
	if (typeof landingPoly != "undefined") {
        landingPoly.setMap(null);
    }

}




function sendMarkersPostion(event) {

	if(markers.length == 2) {
		mapLanding.markerUpdate(markers[0].getPosition().lat(),markers[0].getPosition().lng(),markers[1].getPosition().lat(),markers[1].getPosition().lng());
	}
}



function addMarker(event) {

	if(markers.length < 2) {
		var marker = new google.maps.Marker({
		    position: event.latLng,
		    map: map,
		    draggable:true,
		    title:"Drag me!"
		});

		markers.push(marker);
		//marker.addListener('drag', sendMarkersPostion);
		marker.addListener('dragend', sendMarkersPostion);

		sendMarkersPostion(null);

	};

//    mapLanding.addPoint(event.latLng.lat(), event.latLng.lng());
}

//google.maps.event.addDomListener(window, 'load', initialize);
