var MapSquare = function (data) {
	this.x = data.x;
	this.y = data.y;
	this.textures = {
		north: data.textures.north,
		east: data.textures.east,
		south: data.textures.south,
		west: data.textures.west,
		floor: data.textures.floor
	};
	this.events = data.events;
};
MapSquare.create = function (x, y) {
	return new MapSquare({
		x: x,
		y: y,
		textures: { north: 0, east: 0, south: 0, west: 0, floor: 0 },
		events: { north: null, east: null, south: null, west: null, floor: null }
	});
};

MapSquare.prototype = {
	toJSON: function () {
		return {
			x: this.x,
			y: this.y,
			textures: this.textures,
			events: this.events
		};
	}
};