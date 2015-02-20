angular.module('OSMSketch', [])
	.controller('osmsketchMap', ['$scope', function ($scope) {
		// Leaflet initialization
		$scope.mapInit = function () {
			var map = L.map('map', { zoomControl: false }).setView([55.889, 37.594], 13);

			L.tileLayer('http://tiles.maps.sputnik.ru/{z}/{x}/{y}.png', {
				attribution: ' © <a href="http://sputnik.ru">Спутник</a> | © <a href="http://www.openstreetmap.org/copyright">Openstreetmap</a>',
				minZoom: 3,
				maxZoom: 18
			}).addTo(map);

			map.MapPaint.saveMethod = function(image, bounds) {
				console.log({image: image, bounds: bounds});
				L.imageOverlay(image, bounds).addTo(map);
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
		};
	}]);
