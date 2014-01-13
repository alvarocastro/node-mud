(function (exports) {
	exports.pack = function (data, type) {
		switch (type) {
			case 'fov':
				var i,
					square,
					result = [];
				for (i in data) {
					square = data[i];
					result.push([
						square.x,
						square.y,
						square.textures.north,
						square.textures.east,
						square.textures.south,
						square.textures.west,
					]);
				}
				
				return result;
				break;

			case 'character':
				return [
					data.x,
					data.y,
					data.direction
				];
				break;

			case 'chat':
				var i,
					message,
					result = [];
				for (i in data) {
					message = data[i];
					result.push([
						message.time,
						message.text,
						message.type,
					]);
				}

				return result;
				break;

			default:
				return data;
				break;
		}
	};

	exports.unpack = function (data, type) {
		switch (type) {
			case 'fov':
				var result = {};
				for (var i = 0, square; square = data[i]; i++) {
					result[square[0] + '_' + square[1]] = {
						x: square[0],
						y: square[1],
						textures: {
							north: square[2],
							east: square[3],
							south: square[4],
							west: square[5],
						}
					};
				}
				
				return result;
				break;

			case 'character':
				return {
					x: data[0],
					y: data[1],
					direction: data[2],
				};
				break;

			case 'chat':
				var result = [];
				for (var i = 0, message; message = data[i]; i++) {
					result.push({
						time: message[0],
						text: message[1],
						type: message[2],
					})
				}

				return result;
				break;

			default:
				return data;
				break;
		}
	};
})(typeof exports === 'undefined' ? this['Packer'] = {} : exports);