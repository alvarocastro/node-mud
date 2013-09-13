/*******************************************************************************
 * Game View 3D
 */
$.fn.rmClass = function (regex) {
	return this.removeClass(function (index, css) {
		return (css.match(regex) || []).join(' ');
	});
};

Game.View = function (game) {
	this.game = game;
	this.element = game.elements.view;

	this.init();
};

Game.View.prototype = {
	init: function () {
		var createCube = function (x, y) {
			var c, extra = '';
			if (y < 1 || y > 4 || x < 1 || x > 5) {
				extra = ' far';
			}
			c = $('\
				<div class="slot slot_' + y + '_' + x + '">\
					<div class="cube' + extra + '">\
						<div class="side north">FRONT</div>\
						<div class="side south">BACK</div>\
						<div class="side east">LEFT</div>\
						<div class="side west">RIGHT</div>\
						<div class="side top">TOP</div>\
						<div class="side bottom">' + y + '_' + x + '</div>\
					</div>\
				</div>\
			');
			return c;
		};

		var x, y;
		for (y = 1; y <= 4; y++) {
			for (x = 1; x <= 5; x++) {
				this.element.append(createCube(x, y));
			}
		}
		/*
		var transEndEventNames = {
				'WebkitTransition' : 'webkitTransitionEnd',
				'MozTransition'    : 'transitionend',
				'OTransition'      : 'oTransitionEnd',
				'msTransition'     : 'MSTransitionEnd',
				'transition'       : 'transitionend'
			},
			transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];

		this.element.parent().on(transEndEventName, function () {console.log('ando?');}, false);
		*/
	},

	clear: function () {
		this.element.find('.side').rmClass(/\btexture\S+/g);
	},

	render: function (character, squares, action) {
		var x = character.x,
			y = character.y,
			d = character.direction,
			delay = action ? 550 : 0;

		//this.element.rmClass(/\bshow-\S+/g).addClass('show-' + d);


		this.element
			.addClass('animate')
			.rmClass(/\banimation-\S+/g)
			.addClass('animation-' + action);

		var inst = this;
		this.game.controls.disable();
		setTimeout(function () {
			inst.clear();
			inst.game.controls.enable();

			inst.element
				.removeClass('animate')
				.rmClass(/\banimation-\S+/g)
				.rmClass(/\bfacing-\S+/g)
				.addClass('facing-' + d);

			var i, b, e;
			for (i in squares) {
				b = squares[i];

				switch (d) {
					case 'north':
						e = inst.element.find('.slot_' + (y + 1 - b.y) + '_' + (b.x + 3 - x));
						break;
					case 'east':
						e = inst.element.find('.slot_' + (b.x + 1 - x) + '_' + (b.y + 3 - y));
						break;
					case 'south':
						e = inst.element.find('.slot_' + (b.y - y + 1) + '_' + (x + 3 - b.x));
						break;
					case 'west':
						e = inst.element.find('.slot_' + (x + 1 - b.x) + '_' + (y + 3 - b.y));
						break;
				}

				if (b.textures.north) { e.find('.north').addClass('texture' + b.textures.north); }
				if (b.textures.east)  { e.find('.east').addClass('texture' + b.textures.east); }
				if (b.textures.south) { e.find('.south').addClass('texture' + b.textures.south); }
				if (b.textures.west)  { e.find('.west').addClass('texture' + b.textures.west); }
			}
		}, delay);
	}
};