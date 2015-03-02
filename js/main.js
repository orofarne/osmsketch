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
	var c1, c2;
	function onLocationFound(e) {
		var radius = e.accuracy / 2;

		if (c1) {
			map.removeLayer(c1);
		}
		if (c2) {
			map.removeLayer(c2);
		}

		c1 = L.circle(e.latlng, 0);
		c2 = L.circle(e.latlng, radius);

		map.addLayer(c1);
		map.addLayer(c2);
	}

	map.on('locationfound', onLocationFound);
	map.locate({watch: true, setView: false});

	// Location button
	var locationControl = L.Control.extend({
		options: {
			position: 'bottomleft'
		},
		onAdd: function (map) {
			var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control location-control');
			container.onclick = function () {
				map.locate({setView: true, maxZoom: 17});
				map.locate({watch: true, setView: false});
			};
			return container;
		}
	});

	map.addControl(new locationControl());

	// Auth button
});
