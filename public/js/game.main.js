/**
 * 3D cube
 * http://jsfiddle.net/K99GS/5/
 */

var Game = function (config) {
	this.debug = config.debug;

	this.elements = {
		debug: $(config.elements.debug),
		view: $(config.elements.view),
		log: $(config.elements.log)
	}


	this.connector = new Game.Connector(this);
	this.controls = new Game.Controls(this);
	this.view = new Game.View(this);

	this.preload();
};

Game.prototype = {
	preload: function () {
		var assets = [
			'/base/bg.png',
			'/base/texture1.png',
			'/base/texture2.png',
			'/base/texture3.png',
			'/base/texture4.png',
			'/base/texture5.png',
		], images = [], loadCount = 0, instance = this;

		if (this.debug) {
			this.elements.debug.find('.ping').text('Preloading images: ' + loadCount + '/' + assets.length);
		}
		for (var i in assets) {
			images[i] = new Image();
			images[i].addEventListener('load', function () {
				loadCount++;

				if (instance.debug) {
					instance.elements.debug.find('.ping').text('Preloading images: ' + loadCount + '/' + assets.length);
				}

				if (loadCount == assets.length) {
					instance.init();
				}
			}, false);
			images[i].src = assets[i];
		}
	},

	init: function () {
		this.connector.send();
	}
};


/*******************************************************************************
 * Game Connector
 */
Game.Connector = function (game) {
	this.game = game;
	this.endpoint = '/game';

	this.actions = {
		move_forward: 'move_forward'
	};
};

Game.Connector.prototype = {
	send: function (params) {
		params = params || {};
		params.r = (new Date()).getTime();

		var instance = this;
		$.getJSON(this.endpoint, params, function (data) {
			var character = data.character ? Packer.unpack(data.character, 'character') : null,
				fov = data.fov ? Packer.unpack(data.fov, 'fov') : null;

			if (character && fov) {
				console.log(character.x, character.y);
				instance.game.view.render(character, fov);
			}

			if (data.chat && data.chat.length) {
				//Game.ChatLog.addMessages(data.chat);
			}
		});
	}
};


/*******************************************************************************
 * Game View
 */
Game.View = function (game) {
	this.game = game;
	this.element = game.elements.view;
};

Game.View.prototype = {
	clear: function () {
		this.element.find('.wall, .border').removeClass(function (i, c) {
			return (c.match(/texture\d+/g) || []).join(' ');
		});
	},

	render: function (character, squares) {
		var x = character.x,
			y = character.y,
			direction = character.direction;

		this.clear();
		for(var i in squares) {
			var b = squares[i];

			switch (direction) {
				case 'north':
					// FRONT
					if (b.textures.north) {
						this.element.find('.wall_3_' + (y + 1 - b.y) + '_' + (b.x + 3 - x)).addClass('texture' + b.textures.north);
					}
					// LEFT
					if (b.textures.west && b.x <= x) {
						this.element.find('.wall_' + (b.x + 2 - x) + '_' + (y - b.y + 1)).addClass('texture' + b.textures.west);
					}
					// RIGHT
					if (b.textures.east && b.x >= x) {
						this.element.find('.wall_' + (b.x + 4 - x) + '_' + (y - b.y + 1)).addClass('texture' + b.textures.east);
					}
					break;
				case 'east':
					// FRONT
					if (b.textures.east) {
						this.element.find('.wall_3_' + (b.x + 1 - x) + '_' + (b.y + 3 - y)).addClass('texture' + b.textures.east);
					}
					// LEFT
					if (b.textures.north && b.y <= y) {
						this.element.find('.wall_' + (b.y + 2 - y) + '_' + (b.x - x + 1)).addClass('texture' + b.textures.north);
					}
					// RIGHT
					if (b.textures.south && b.y >= y) {
						this.element.find('.wall_' + (b.y + 4 - y) + '_' + (b.x - x + 1)).addClass('texture' + b.textures.south);
					}
					break;
				case 'south':
					// FRONT
					if (b.textures.south) {
						this.element.find('.wall_3_' + (b.y - y + 1) + '_' + (x + 3 - b.x)).addClass('texture' + b.textures.south);
					}
					// LEFT
					if (b.textures.east && b.x >= x) {
						this.element.find('.wall_' + (x + 2 - b.x) + '_' + (b.y - y + 1)).addClass('texture' + b.textures.east);
					}
					// RIGHT
					if (b.textures.west && b.x <= x) {
						this.element.find('.wall_' + (x + 4 - b.x) + '_' + (b.y - y + 1)).addClass('texture' + b.textures.west);
					}
					break;
				case 'west':
					// FRONT
					if (b.textures.west) {
						this.element.find('.wall_3_' + (x + 1 - b.x) + '_' + (y + 3 - b.y)).addClass('texture' + b.textures.west);
					}
					// LEFT
					if (b.textures.south && b.y >= y) {
						this.element.find('.wall_' + (y + 2 - b.y) + '_' + (x - b.x + 1)).addClass('texture' + b.textures.south);
					}
					// RIGHT
					if (b.textures.north && b.y <= y) {
						this.element.find('.wall_' + (y + 4 - b.y) + '_' + (x - b.x + 1)).addClass('texture' + b.textures.north);
					}
					break;
			}
		}

		var instance = this;
		this.element.find('.border').each(function () {
			var pos = $(this).attr('class').substr(14),
				wall = instance.element.find('.wall.wall_' + pos + '[class*="texture"]');

			if (wall.length) {
				$(this).addClass(wall.attr('class').substr(-8));
			}
		});
	}
};


/*******************************************************************************
 * Game Controls
 */
Game.Controls = function (game) {
	this.game = game;

	var key = {
		UP: 38,
		DOWN: 40,
		LEFT: 37,
		RIGHT: 39,
		
		HOME: 36,
		END: 35,
		PGUP: 33,
		PGDN: 34,
		
		NUMPAD_1: 97,
		NUMPAD_2: 98,
		NUMPAD_3: 99,
		NUMPAD_4: 100,
		NUMPAD_5: 101,
		NUMPAD_6: 102,
		NUMPAD_7: 103,
		NUMPAD_8: 104,
		NUMPAD_9: 105
	};
	this.key = key;
	
	this.bindings = [];
	
	
	this.bind(this.moveForward, [key.UP, key.NUMPAD_8]);
	this.bind(this.moveBackwards, [key.DOWN, key.NUMPAD_2]);
	this.bind(this.moveLeft, [key.LEFT, key.NUMPAD_4]);
	this.bind(this.moveRight, [key.RIGHT, key.NUMPAD_6]);
	this.bind(this.turnLeft, [key.NUMPAD_7, key.NUMPAD_1]);
	this.bind(this.turnRight, [key.NUMPAD_9, key.NUMPAD_3]);
	
	var instance = this;
	$(document).bind('keydown', function (e) {
		instance.keyPress(e);
	});
};

Game.Controls.prototype = {
	bind: function (action, keys) {
		for (var i in keys) {
			this.bindings[keys[i]] = action;
		}
	},

	keyPress: function (e) {
		var key = e.keyCode;
		if (this.bindings[key]) {
			this.bindings[key].call(this);
			e.preventDefault();
		}
	},

	moveForward: function () {
		this.game.connector.send({action: 'move_forward'});
	},

	moveBackwards: function () {
		this.game.connector.send({action: 'move_backwards'});
	},

	moveLeft: function () {
		this.game.connector.send({action: 'move_left'});
	},

	moveRight: function () {
		this.game.connector.send({action: 'move_right'});
	},

	turnLeft: function () {
		this.game.connector.send({action: 'turn_left'});
	},

	turnRight: function () {
		this.game.connector.send({action: 'turn_right'});
	}
};




var TEST = function () {
	var i, k, e = jQuery.Event("keydown"), ks = [38,37,40,40,39,39,38,38,37,40];
	for (i = 0; k = ks[i]; i++) {
		setTimeout((function (k) {
			return function () {
				e.keyCode = k;
				$(document).trigger(e);
			}
		})(k), i * 100);
	}
};