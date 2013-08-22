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
		var action = params.action;
		var instance = this;
		$.getJSON(this.endpoint, params, function (data) {
			var character = data.character ? Packer.unpack(data.character, 'character') : null,
				fov = data.fov ? Packer.unpack(data.fov, 'fov') : null;

			if (character && fov) {
				console.log(character.x, character.y, character.direction);
				instance.game.view.render(character, fov, action);
			}

			if (data.chat && data.chat.length) {
				//Game.ChatLog.addMessages(data.chat);
			}
		});
	}
};