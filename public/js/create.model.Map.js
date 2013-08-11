var Map = function (id, callback) {
	this.id = id;
	this.code;
	this.name;
	this.squares = {};

	if (this.id) {
		this.load(callback);
	}
};
Map.size = 16;
Map.create = function (data) {
	var s, m = new Map();
	for (var y = 0; y < Map.size; y++) {
		for (var x = 0; x < Map.size; x++) {
			s = MapSquare.create(x, y);
			m.addSquare(s);
		}
	}
	m.code = data.code;
	m.title = data.title;
	return m;
};
Map.findAll = function (callback) {
	var req = $.getJSON('/data/map')
		.success(function (result) {
			callback(result.data);
		})
		.error(function (data) {
			throw 'Error: Map.findAll()';
		});
};

Map.prototype = {
	addSquare: function (square) {
		this.squares[square.x + '_' + square.y] = square;
	},

	getSquare: function (x, y) {
		return this.squares[x + '_' + y];

		/*
		for (var s, i = 0, c = this.squares.length; s = this.squares[i]; i++) {
			if (s.x == x && s.y == y) {
				return s;
			}
		}
		*/
	},

	load: function (callback) {
		var instance = this;
		var req = $.getJSON('/data/map/' + this.id)
			.success(function (result) {
				var square, data = result.data;
				instance.id = data._id;
				instance.code = data.code;
				instance.title = data.title;

				for (var i in data.squares) {
					square = data.squares[i];
					instance.squares[square.x + '_' + square.y] = new MapSquare(square);
				}
				/*
				for (var i = 0, square; square = data.squares[i]; i++) {
					instance.addSquare(new MapSquare(square));
				}
				*/
				callback(result.error, result.data);
			})
			.error(function (data) {
				throw 'Error: Map.load(' + instance.id + ')';
			});
	},

	save: function () {
		var url, success = function (data) {
				console.log(data);
			},
			error = function (data) {
				console.error(data);
				throw 'Error: Map.save()';
			};

		if (this.id) {
			url = '/data/map/' + this.id;
		} else {
			url = '/data/map';
		}

		$.post(url, this.toJSON())
			.success(success)
			.error(error);
	},

	toJSON: function () {
		var square, data = {
			_id: this.id,
			code: this.code,
			title: this.title,
			squares: {}
		};
		for (var i in this.squares) {
			square = this.squares[i];
			data.squares[square.x + '_' + square.y] = square.toJSON();
		}
		return data;
	}
};