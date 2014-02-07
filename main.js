var loadtest = require('loadtest'),
	express = require('express'),
	harp = require('harp'),
	app = express(),
	server,
	io;

app.configure(function () {
	app.use(express.static(__dirname + '/public'));
	app.use(harp.mount(__dirname + '/public'));
});

server = app.listen(9000);
io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	socket.on('start', function (options) {
		console.log(options);

		// Sanitize options
		options = JSON.parse(JSON.stringify(options));

		loadtest.loadTest(options, function (err, result) {
			if (err) {
				socket.emit('error', err);
				console.error(err);
			} else {
				socket.emit('result', result);
				console.log(result);
			}
		});
	});
});