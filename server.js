process.env.MONGOHQ_URL = 'mongodb://heroku:1bb3779a781226c71ca32d554df37d16@paulo.mongohq.com:10056/app17451547';

var express = require('express')
	Map = require('./models/map.js').Map,
	Square = require('./models/square.js').Square,
	Character = require('./models/character.js').Character,
	Packer = require('./public/js/packer.js');

console.log('################################################################################' + "\n" +
	'START: ' + (new Date()).getTime());

var app = express();

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));


Map.findAll(function (error, data) {
	for (var i = 0, map; map = data[i]; i++) {
		Map.cache[map.code] = new Map(map);
	}

	app.listen(3000);
});


/*
Character.create({name: 'Moltar'}, function (error, data) {
	res.send({
		error: error,
		data: data
	});
});
//*/





app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});
app.get('/3d', function (req, res) {
	res.sendfile(__dirname + '/public/index3d.html');
});

app.get('/create', function (req, res) {
	res.sendfile(__dirname + '/public/create.html');
});

var cid = '520454659cad8f5f39000001';

app.get('/game', function (req, res) {
	console.log('# REQUEST: ' + (new Date()).getTime());
	Character.findOneById(cid, function (error, data) {
		var c = new Character(data),
			action = req.query.action;

		var cb = function () {
			res.send({
				error: error,
				character: Packer.pack(c.position, 'character'),
				fov: Packer.pack(c.getFov(), 'fov')
			});
		};


		switch (action) {
			case 'move_forward':
				console.log('- ACTION: move_forward');
				c.move('forward', cb);
				break;
			case 'move_backwards':
				console.log('- ACTION: move_backwards');
				c.moveBackwards(cb);
				break;
			case 'move_left':
				console.log('- ACTION: move_left');
				c.moveLeft(cb);
				break;
			case 'move_right':
				console.log('- ACTION: move_right');
				c.moveRight(cb);
				break;
			case 'turn_left':
				console.log('- ACTION: turn_left');
				c.turnLeft(cb);
				break;
			case 'turn_right':
				console.log('- ACTION: turn_right');
				c.turnRight(cb);
				break;
			default:
				console.log('- ACTION: DEFAULT');
				cb();
				break;
		}
	});
});



app.post('/data/character', function (req, res) {

});



app.post('/data/map', function (req, res) {
	Map.create(req.body, function (error, data) {
		res.send({
			error: error,
			data: data
		});
	});
});

app.get('/data/map', function (req, res) {
	Map.findAll(function (error, data) {
		res.send({
			error: error,
			data: data
		});
	});
});

app.post('/data/map/:id', function (req, res) {
	var map = new Map(req.body);
	map.save(function (error, data) {
		res.send({
			error: error,
			data: data
		});
	});
});

app.get('/data/map/:id', function (req, res) {
	Map.findOneById(req.params.id, function (error, data) {
		res.send({
			error: error,
			data: data
		});
	});
});





/*
app.get('/getview/:action?', function (req, res) {
	var action = req.params.action;


	switch (action) {
		case 'move_forward':
			break;
	}

	res.send({
		'action': action
	});
});
*/