var mongojs = require('mongojs'),
	db = mongojs(process.env.MONGOHQ_URL, ['map']);


var Map = function (data) {
	data = data || {};
	this.id = data._id;
	this.code = data.code;
	this.title = data.title;
	this.squares = {};
	for (var i in data.squares) {
		this.squares[i] = new Square(data.squares[i]);
	}
};
Map.cache = {};

Map.get = function (code) {
	return this.cache[code];
};

Map.create = function (data, callback) {
	var square, squares = {};
	for (var i in data.squares) {
		square = data.squares[i];
		squares[i] = {
			x: parseInt(square.x),
			y: parseInt(square.y),
			textures: {
				north: parseInt(square.textures.north),
				east: parseInt(square.textures.east),
				south: parseInt(square.textures.south),
				west: parseInt(square.textures.west),
				floor: parseInt(square.textures.floor),
			},
			events: square.events
		};
	}

	db.map.insert({
		code: data.code,
		title: data.title,
		squares: squares
	}, callback);
};

Map.findAll = function (callback) {
	db.map.find().toArray(callback);
};

Map.findOneByCode = function (code, callback) {
	db.map.findOne({code: code}, callback);
};

Map.findOneById = function (id, callback) {
	db.map.findOne({_id: new mongojs.ObjectId(id)}, callback);
};

Map.prototype = {
	save: function (callback) {
		var squares = {};
		for (var i in this.squares) {
			squares[i] = this.squares[i].toJSON();
		}
		db.map.update(
			{code: this.code},
			{$set: {
				code: this.code,
				title: this.title,
				squares: squares
			}}, 
			{upsert: true},
			callback
		);
	},

	getSquare: function (x, y) {
		return this.squares[x + '_' + y];
	},

	getSquares: function (range) {
		var square,
			squares = {},
			srange = {
				x: {
					start: range.x.start > range.x.end ? range.x.end : range.x.start,
					end: range.x.start > range.x.end ? range.x.start : range.x.end,
				},
				y: {
					start: range.y.start > range.y.end ? range.y.end : range.y.start,
					end: range.y.start > range.y.end ? range.y.start : range.y.end,
				}
			};

		for (var y = srange.y.start; y <= srange.y.end; y++) {
			for (var x = srange.x.start; x <= srange.x.end; x++) {
				square = this.squares[x + '_' + y];
				if (square) {
					squares[x + '_' + y] = this.squares[x + '_' + y];
				}
			}
		}
		
		return squares;
	}
};

/*
var Square = function (data) {

};

Square.prototype = {
};
*/

exports.Map = Map;
//exports.Square = Square;