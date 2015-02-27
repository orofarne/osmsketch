"use strict";

// @include impl/imgstore.js

$( document ).ready(function () {
	L.Icon.Default.imagePath = "/images";

	var map = L.map('map', { zoomControl: false });

	// Leaflet.RestoreView plugin
	if (!map.restoreView()) {
		map.setView([55.889, 37.594], 13);
	}

	// Sputnik.ru layer
	L.tileLayer('http://tiles.maps.sputnik.ru/{z}/{x}/{y}.png', {
		attribution: ' © <a href="http://sputnik.ru">Спутник</a> | © <a href="http://www.openstreetmap.org/copyright">Openstreetmap</a>',
		minZoom: 3,
		maxZoom: 18
	}).addTo(map);

	var imgstore = new ImgStore(map);

	// MapPaint save method for images
	map.MapPaint.saveMethod = function(image, bounds) {
		imgstore.add(image, bounds);
	}

	var zoomControl = new L.Control.Zoom({ position: 'topleft' })
	var paintControl = L.Control.extend({
		options: {
			position: 'topleft'
		},
		onAdd: function (map) {
			var container = L.DomUtil.create('div', 'leaflet-bar mappaint-switch');

			var mapPaint = map.MapPaint;

			if (mapPaint.enabled()) {
				container.classList.add("enabled");
			}

			container.onclick = function () {
				if (mapPaint.enabled()) {
					mapPaint.disable();
					container.classList.remove("enabled");
					map.addControl(zoomControl);
				} else {
					mapPaint.enable();
					container.classList.add("enabled");
					map.removeControl(zoomControl);
				}
				return false;
			};

			return container;
		}
	});

	map.addControl(new paintControl());
	map.addControl(zoomControl);

	// Location
	function onLocationFound(e) {
		console.log("onLocationFound(e)", e);

		var radius = e.accuracy / 2;

		L.marker(e.latlng).addTo(map);
		L.circle(e.latlng, radius).addTo(map);
	}

	map.on('locationfound', onLocationFound);
	map.locate();
});
