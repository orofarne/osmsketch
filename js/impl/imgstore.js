var ImgStore = function(map) {
	this.map = map;
	this.storage = window.localStorage || {};
	this.images = JSON.parse(this.storage['images'] || '[]');

	// Add images to map
	for (var i = 0; i < this.images.length; i++) {
		var img = this.images[i];
		var bounds = L.latLngBounds(
				L.latLng(img.bounds._southWest.lat, img.bounds._southWest.lng),
				L.latLng(img.bounds._northEast.lat, img.bounds._northEast.lng)
				);
		L.imageOverlay(img.image, bounds).addTo(this.map);
	};

	this.add = function(image, bounds) {
		// Add image to map
		L.imageOverlay(image, bounds).addTo(this.map);
		// Store image to localstorage
		this.images.push({
			image: image,
			bounds: bounds
		});
		this.storage['images'] = JSON.stringify(this.images);
	}
};
