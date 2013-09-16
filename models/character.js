var mongojs = require('mongojs'),
	db = mongojs(process.env.MONGOHQ_URL, ['character']);


var Character = function (data) {
	this.id = data._id;
	this.name = data.name;
	this.position = data.position;
	this.stats = {};
	this.map = Map.get(data.position.map);
};
Character.cache = {};

Character.get = function (name) {
	return this.cache[name];
};

Character.create = function (data, callback) {
	db.character.insert({
		name: data.name,
		position: {
			map: 'level_1',
			x: 7,
			y: 12,
			direction: 'north'
		}
	}, callback);
};

Character.findAll = function (callback) {
	db.character.find().toArray(callback);
};

Character.findOneById = function (id, callback) {
	db.character.findOne({_id: new mongojs.ObjectId(id)}, callback);
};

Character.prototype = {
	save: function (callback) {
		db.character.update(
			{_id: this.id},
			{
				$set: {
					name: this.name,
					position: this.position
				}
			}, 
			{upsert: true},
			callback
		);
	},

	changePosition: function (position) {
		this.position = {
			x: position.x || this.position.x,
			y: position.y || this.position.y,
			direction: position.direction || this.position.direction,
			map: position.map || this.position.map.code
		};
	},

	move: function (move, callback) {
		var from = {
				x: this.position.x,
				y: this.position.y,
				direction: this.position.direction,
				map: this.position.map,
			},
			to = {
				x: this.position.x,
				y: this.position.y,
				direction: this.position.direction,
				map: this.position.map,
			},
			dir;

		switch (move) {
			case 'move_forward': dir = this.moveForward(to);break;
			case 'move_backwards': dir = this.moveBackwards(to);break;
			case 'move_left': dir = this.moveLeft(to);break;
			case 'move_right': dir = this.moveRight(to);break;
			case 'turn_left': dir = this.turnLeft(to);break;
			case 'turn_right': dir = this.turnRight(to);break;
		}


		var doMove = true,
			square = this.map.getSquare(from.x, from.y);

		switch (move) {
			case 'move_forward':
			case 'move_backwards':
			case 'move_left':
			case 'move_right':
				var targetSquare = this.map.getSquare(to.x, to.y);
				doMove = square.triggerOnLeave(this, from, to, dir);
				targetSquare.triggerOnEnter(this, from, to);
				targetSquare.triggerOnLook(this, from, to);

				break;
			case 'turn_left':
			case 'turn_right':
				square.triggerOnLook(this, from, to);

				break;
		}



		if (doMove) {
			this.position = to;
		}

		callback();
	},

	moveForward: function (td) {
		switch (this.position.direction) {
			case 'north':td.y--; return 'north';
			case 'east': td.x++; return 'east';
			case 'south':td.y++; return 'south';
			case 'west': td.x--; return 'west';
		}
	},

	moveBackwards: function (td) {
		switch (this.position.direction) {
			case 'north':td.y++; return 'south';
			case 'east': td.x--; return 'west';
			case 'south':td.y--; return 'north';
			case 'west': td.x++; return 'east';
		}
	},

	moveLeft: function (td) {
		switch (this.position.direction) {
			case 'north':td.x--; return 'west';
			case 'east': td.y--; return 'north';
			case 'south':td.x++; return 'east';
			case 'west': td.y++; return 'south';
		}
	},

	moveRight: function (td) {
		switch (this.position.direction) {
			case 'north':td.x++; return 'east';
			case 'east': td.y++; return 'south';
			case 'south':td.x--; return 'west';
			case 'west': td.y--; return 'north';
		}
	},

	turnLeft: function (td) {
		switch (this.position.direction) {
			case 'north':td.direction = 'west';break;
			case 'east': td.direction = 'north';break;
			case 'south':td.direction = 'east';break;
			case 'west': td.direction = 'south';break;
		}
	},

	turnRight: function (td) {
		switch (this.position.direction) {
			case 'north':td.direction = 'east';break;
			case 'east': td.direction = 'south';break;
			case 'south':td.direction = 'west';break;
			case 'west': td.direction = 'north';break;
		}
	},

	getFov: function () {
		var p = this.position,
			r = {};

		switch (p.direction) {
			case 'north':
				r = {
					x: {start: p.x - 2, end: p.x + 2},
					y: {start: p.y - 3, end: p.y}
				};
				break;
			case 'east':
				r = {
					x: {start: p.x, end: p.x + 3},
					y: {start: p.y - 2, end: p.y + 2}
				};
				break;
			case 'south':
				r = {
					x: {start: p.x - 2, end: p.x + 2},
					y: {start: p.y, end: p.y + 3}
				};
				break;
			case 'west':
				r = {
					x: {start: p.x - 3, end: p.x},
					y: {start: p.y - 2, end: p.y + 2}
				};
				break;
		}

		return this.map.getSquares(r);
	}
};


exports.Character = Character;