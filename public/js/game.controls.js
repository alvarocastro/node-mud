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

	this.disabled = true;
	
	
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
	enable: function () {
		this.disabled = false;
	},

	disable: function () {
		this.disabled = true;
	},

	bind: function (action, keys) {
		for (var i in keys) {
			this.bindings[keys[i]] = action;
		}
	},

	keyPress: function (e) {
		var key = e.keyCode;
		if (!this.disabled && this.bindings[key]) {
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