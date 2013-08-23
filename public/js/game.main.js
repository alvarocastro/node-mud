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