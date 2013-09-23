var Square = function (data) {
	this.x = data.x;
	this.y = data.y;
	this.textures = data.textures;
	this.events = data.events;
};

Square.prototype = {
	//square
	triggerOnRotate: function () {
		console.log('- EVENT: onRotate(x:' + this.x + '|y:' + this.y + ')');
	},

	//square
	triggerOnEnter: function () {
		console.log('- EVENT: onEnter(x:' + this.x + '|y:' + this.y + ')');
	},

	//square
	triggerOnLeave: function (c, op, tp, dir) {
		console.log('- EVENT: onLeave(x:' + this.x + '|y:' + this.y + ')');
	},

	//wall
	triggerOnLook: function () {
		console.log('- EVENT: onLook(x:' + this.x + '|y:' + this.y + ')');
		//return this.executeEvents(this.events[dir]);
	},

	//wall
	triggerOnWalk: function (c, op, tp, dir) {
		console.log('- EVENT: onWalk(x:' + this.x + '|y:' + this.y + ')');
		return this.executeEvents(this.events[dir]['on_walk']);
	},

	//wall|square
	triggerOnItemUse: function () {
		console.log('- EVENT: onItemUse(x:' + this.x + '|y:' + this.y + ')');
	},

	executeEvents: function (events) {
		if (!events) {
			return true;
		}
		for (var i = 0, event; event = events[i]; i++) {
			switch (event.type) {
				case 'block-movement':
					console.log('- EVENT EXECUTE: block-movement');
					return false;
					break;
				case 'log':
					console.log('- EVENT EXECUTE: log');
					break;
				default:
					console.log('- EVENT EXECUTE: DEFAULT');
					break;
			}
		}
		return true;
	},

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