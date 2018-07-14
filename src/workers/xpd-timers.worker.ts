namespace worker.time {

	const ctx: Worker = self as any;

	ctx.addEventListener('message', (event) => {
		const data = event.data;

		switch (data.cmd) {

			case 'interval':
				setInterval(function () {
					ctx.postMessage('interval');
				}, data.timeout);
				break;
			case 'timeout':
				setTimeout(function () {
					ctx.postMessage('timeout');
				}, data.timeout);
				break;
			default:
				console.log('[Worker] Unable to handle ', data);
				break;
		}

	}, false);

}
