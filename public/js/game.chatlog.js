/*******************************************************************************
 * Game ChatLog
 */
Game.ChatLog = function (game) {
	this.game = game;
	this.element = game.elements.log;
};

Game.ChatLog.prototype = {
	addMessages: function (messages) {
		var i, message;
		for (i = 0, message; message = messages[i]; i++) {
			this.element.append('<div class="message"><p>'+message.text+'</p><div class="time">'+message.time+'</div></div>');
		}

		this.element.scrollTop(this.element.prop('scrollHeight'));
	}
};