import { LoginPage } from '../pages/login.po';

describe('Well page', () => {
	let page: LoginPage;

	beforeEach(() => {
		page = new LoginPage();
	});

	it('login', () => {
		page.navigateTo();
		page.login();
		// expect(page.getParagraphText()).toEqual('Welcome to app!');
	});
});
