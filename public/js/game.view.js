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