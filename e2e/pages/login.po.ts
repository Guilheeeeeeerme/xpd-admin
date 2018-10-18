import { browser, by, element } from 'protractor';

export class LoginPage {

	private accessIp = '200.235.79.164';

	public navigateTo() {
		return browser.get('/auth.html#/').then(
			() => {
				return;
			},
		);
	}

	public login() {
		const username = element(by.id('operation-general-info-data-username'));
		username.sendKeys('admin');

		const password = element(by.id('operation-general-info-data-password'));
		password.sendKeys('rzxtec123');

		const operationServer = element(by.id('xpdDefaultAccessIp'));
		operationServer.clear();
		operationServer.sendKeys(this.accessIp);

		const setupApi = element(by.id('xpdDefaultSetupAPIAccessIp'));
		setupApi.clear();
		setupApi.sendKeys(this.accessIp);

		const reportsApi = element(by.id('xpdDefaultReportsAPIAccessIp'));
		reportsApi.clear();
		reportsApi.sendKeys(this.accessIp);

		element(by.id('login')).click();
		return element(by.id('confirm')).click().then(
			() => {
				return;
			},
		);
	}

	public clickButtonAddWell() {
		return element(by.partialLinkText('Well')).click();
	}
}
