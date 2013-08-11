var Square = function (data) {
	this.x = data.x;
	this.y = data.y;
	this.textures = data.textures;
	this.events = data.events;
};

Square.prototype = {
	toJSON: function () {
		return {
			x: parseInt(this.x),
			y: parseInt(this.y),
			textures: {
				north: parseInt(this.textures.north),
				east: parseInt(this.textures.east),
				south: parseInt(this.textures.south),
				west: parseInt(this.textures.west),
				floor: parseInt(this.textures.floor)
			},
			events: this.events
		};
	}
};

exports.Square = Square;