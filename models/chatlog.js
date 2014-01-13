var ChatLog = function (data) {
	this.messages = [];
};
ChatLog.TYPE_NORMAL = '0';
ChatLog.TYPE_INFO = '1';

ChatLog.prototype = {
	push: function (text, type) {
		this.messages.push({
			time: +new Date(),
			text: text,
			type: type,
		});
	},

	getMessages: function () {
		var r = this.messages;
		this.messages = [];
		return r;
	}
};

exports.ChatLog = ChatLog;