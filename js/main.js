angular.module('OSMSketch', [])
	.controller('osmsketchMap', ['$scope', function ($scope) {
		// Leaflet initialization
		$scope.mapInit = function () {
			var map = L.map('map').setView([55.889, 37.594], 13);
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
				minZoom: 3,
				maxZoom: 18
			}).addTo(map);
			map.addControl(new MapPaint.SwitchControl());
		};
	}]);
