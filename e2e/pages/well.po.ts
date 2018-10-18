import { browser, by, element } from 'protractor';

export class WellPage {
	public navigateTo() {
		return element(by.id('nav-bar-setup')).click().then(
			() => {
				return;
			},
		);
	}

	public clickButtonOpenModal() {
		return element(by.id('setup-well-add-well')).click().then(
			() => {
				setTimeout(() => {
					return;
				}, 5000);
			},
		);
	}

	public createWell() {
		const name = element(by.id('well-upsert-data-name'));
		name.sendKeys('Well e2e');

		const airGap = element(by.id('well-upsert-data-airGap'));
		airGap.sendKeys(10);

		const waterDepth = element(by.id('well-upsert-data-waterDepth'));
		waterDepth.sendKeys(2000);

		element(by.id('well-upsert-button-save')).click().then(
			() => {
				return;
			},
		);
	}

	public getWellList() {
		element.all(by.repeater('well in dados.wellList')).then(
			(rows) => {
				browser.debugger();
				console.log('rows', rows);
				return rows ;
			},
		);
		// return element(by.model('dados.wellList'));
	}
}
