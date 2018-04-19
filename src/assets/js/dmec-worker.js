var tracks = {};

addEventListener('message', function (e) {
	var data = e.data;
	switch (data.cmd) {
	case 'start':
		tracks = {};
		break;
	case 'applyOverflow':
		// tracks = data;
		// postMessage(applyOverflow());
		break;
	default:
		console.log(data);
		break;
	}
}, false);