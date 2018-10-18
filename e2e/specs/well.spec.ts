import { LoginPage } from '../pages/login.po';
import { WellPage } from '../pages/well.po';

describe('Well page', () => {
	let loginPage: LoginPage;
	let wellPage: WellPage;

	beforeEach(() => {
		loginPage = new LoginPage();
		wellPage = new WellPage();
	});

	it('login', () => {
		loginPage.navigateTo();
		loginPage.login();
	});

	it('should open well modal', () => {

		wellPage.navigateTo();
		wellPage.clickButtonOpenModal();
	});

	it('should register well', () => {
		wellPage.createWell();
	});

	it('there must be two wells ', () => {
		const wellList = wellPage.getWellList();
		expect(wellList).toBe(2);
	});
});
