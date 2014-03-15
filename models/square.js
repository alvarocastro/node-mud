var Square = function (data) {
	this.x = data.x;
	this.y = data.y;
	this.textures = data.textures;
	this.events = data.events;
};

Square.prototype = {
	//square
	triggerOnRotate: function (c, op, tp, dir) {
		console.log('- EVENT: onRotate(x:' + this.x + '|y:' + this.y + ')');
		return true;
	},

	//square
	triggerOnEnter: function (c, op, tp, dir) {
		console.log('- EVENT: onEnter(x:' + this.x + '|y:' + this.y + ')');
		return true;
	},

	//square
	triggerOnLeave: function (c, op, tp, dir) {
		console.log('- EVENT: onLeave(x:' + this.x + '|y:' + this.y + ')');
		return true;
	},

	//wall
	triggerOnLook: function (c, op, tp, dir) {
		console.log('- EVENT: onLook(x:' + this.x + '|y:' + this.y + ')');
		return this.executeEvents(this.events[dir], c);
	},

	//wall
	triggerOnWalk: function (c, op, tp, dir) {
		console.log('- EVENT: onWalk(x:' + this.x + '|y:' + this.y + ')');
		return this.executeEvents(this.events[dir]['on_walk'], c);
	},

	//wall|square
	triggerOnItemUse: function () {
		console.log('- EVENT: onItemUse(x:' + this.x + '|y:' + this.y + ')');
		return true;
	},

	executeEvents: function (events, c) {
		if (!events) {
			return true;
		}
		for (var i = 0, event; event = events[i]; i++) {
			switch (event.type) {
				case 'block-movement':
					console.log('- EVENT EXECUTE: block-movement');
					return false;
					break;
				case 'show-text':
					console.log('- EVENT EXECUTE: show-text');
					c.chatLog.push(event.data.text, event.data.type);
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