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
		var od = {
				x: this.position.x,
				y: this.position.y,
				direction: this.position.direction,
				map: this.position.map,
			},
			td = {
				x: this.position.x,
				y: this.position.y,
				direction: this.position.direction,
				map: this.position.map,
			};

		switch (move) {
			case 'move_forward': this.moveForward(td);break;
			case 'move_backwards': this.moveBackwards(td);break;
			case 'move_left': this.moveLeft(td);break;
			case 'move_right': this.moveRight(td);break;
			case 'turn_left': this.turnLeft(td);break;
			case 'turn_right': this.turnRight(td);break;
		}

		var square = this.map.getSquare(od.x, od.y);
		var targetSquare = this.map.getSquare(td.x, td.y);


		square.triggerOnLeave(od, td);
		targetSquare.triggerOnEnter();
		targetSquare.triggerOnLook();
		
		this.position = td;

		callback();
	},

	moveForward: function (td) {
		switch (this.position.direction) {
			case 'north':td.y--;break;
			case 'east': td.x++;break;
			case 'south':td.y++;break;
			case 'west': td.x--;break;
		}
	},

	moveBackwards: function (td) {
		switch (this.position.direction) {
			case 'north':td.y++;break;
			case 'east': td.x--;break;
			case 'south':td.y--;break;
			case 'west': td.x++;break;
		}
	},

	moveLeft: function (td) {
		switch (this.position.direction) {
			case 'north':td.x--;break;
			case 'east': td.y--;break;
			case 'south':td.x++;break;
			case 'west': td.y++;break;
		}
	},

	moveRight: function (td) {
		switch (this.position.direction) {
			case 'north':td.x++;break;
			case 'east': td.y++;break;
			case 'south':td.x--;break;
			case 'west': td.y--;break;
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