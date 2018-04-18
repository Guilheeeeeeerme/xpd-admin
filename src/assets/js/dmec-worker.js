var tracks = {};

addEventListener('message', function (e) {
	var data = e.data;
	switch (data.cmd) {
	case 'start':
		tracks = {};
		break;
	case 'applyOverflow':
		tracks = data;
		postMessage(applyOverflow());
		break;
	default:
		console.log(data);
		break;
	}
}, false);

function applyOverflow() {
	var path = null;

	tracks.map(function (track) {

		if (!path) {
			path = {};
		}

		if (path && path[track.param]) {
			path[track.param] = handleOverflow(path[track.param], track);
			path[track.param] = track.lineFunction(path[track.param]);
		}

	});

	return path;
}

function handleOverflow(points, track) {

	var result = [];
	var distance = 0;
	var lastPoint = null;

	while ((track.min + distance) <= track.max) {
		distance++;
	}

	points.map(function (pt) {

		var point = JSON.parse(JSON.stringify(pt));

		var empty = {
			x: point.x,
			y: null,
			actual: null
		};

		point.overflow = 0;

		if (point.y != null) {

			for (var i = 0; i < 2; i++) {

				if (point.y < track.min) {

					while (point.y < track.min) {
						point.overflow++;
						point.y += distance;
					}

				}

				if (point.y > track.max) {

					while (point.y > track.max) {
						point.overflow--;
						point.y -= distance;
					}

				}

			}

		}

		if (lastPoint != null && lastPoint.overflow != point.overflow) {
			result.push(empty);
		}

		lastPoint = point;

		result.push(point);

	});

	return result;
}