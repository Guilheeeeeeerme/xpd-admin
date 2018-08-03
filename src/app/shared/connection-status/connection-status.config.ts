export class ConnectionStatusConfig {

	public static $inject: string[] = [];

	constructor() {

		if (!document.getElementById('xpd-connection-status')) {
			document.body.innerHTML += '<xpd-connection-status id="xpd-connection-status"></xpd-connection-status>';
		}

	}

}
