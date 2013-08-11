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
	save: function (data, callback) {
		/*
		db.character.update(
			{code: data.code},
			{$set: data}, 
			{upsert: true},
			callback
		);
		*/
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