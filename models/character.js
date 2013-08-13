var mongojs = require('mongojs'),
	db = mongojs('mud', ['character']);


var Character = function (data) {
	this.id = data._id;
	this.name = data.name;
	this.position = data.position;
	this.position.map = Map.get(data.position.map);
	this.stats = {};
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
					position: {
						x: this.position.x,
						y: this.position.y,
						direction: this.position.direction,
						map: this.position.map.code
					}
				}
			}, 
			{upsert: true},
			callback
		);
	},

	moveForward: function (callback) {
		var x = this.position.x,
			y = this.position.y;

		switch (this.position.direction) {
			case 'north':
				y--;
				break;
			case 'east':
				x++;
				break;
			case 'south':
				y++;
				break;
			case 'west':
				x--;
				break;
		}

		this.position.x = x;
		this.position.y = y;

		this.save(callback);
	},

	moveBackwards: function (callback) {
		var x = this.position.x,
			y = this.position.y;

		switch (this.position.direction) {
			case 'north':
				y++;
				break;
			case 'east':
				x--;
				break;
			case 'south':
				y--;
				break;
			case 'west':
				x++;
				break;
		}

		this.position.x = x;
		this.position.y = y;

		this.save(callback);
	},

	moveLeft: function (callback) {
		var x = this.position.x,
			y = this.position.y;

		switch (this.position.direction) {
			case 'north':
				x--;
				break;
			case 'east':
				y--;
				break;
			case 'south':
				x++;
				break;
			case 'west':
				y++;
				break;
		}

		this.position.x = x;
		this.position.y = y;

		this.save(callback);
	},

	moveRight: function (callback) {
		var x = this.position.x,
			y = this.position.y;

		switch (this.position.direction) {
			case 'north':
				x++;
				break;
			case 'east':
				y++;
				break;
			case 'south':
				x--;
				break;
			case 'west':
				y--;
				break;
		}

		this.position.x = x;
		this.position.y = y;

		this.save(callback);
	},

	turnLeft: function (callback) {
		var direction = this.position.direction;

		switch (this.position.direction) {
			case 'north':
				direction = 'west';
				break;
			case 'east':
				direction = 'north';
				break;
			case 'south':
				direction = 'east';
				break;
			case 'west':
				direction = 'south';
				break;
		}

		this.position.direction = direction;

		this.save(callback);
	},

	turnRight: function (callback) {
		var direction = this.position.direction;

		switch (this.position.direction) {
			case 'north':
				direction = 'east';
				break;
			case 'east':
				direction = 'south';
				break;
			case 'south':
				direction = 'west';
				break;
			case 'west':
				direction = 'north';
				break;
		}

		this.position.direction = direction;

		this.save(callback);
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

		return p.map.getSquares(r);
	}
};


exports.Character = Character;