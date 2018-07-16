export class MenuConfirmationService {

	public static $inject: string[] = [];

	public blockMenu = false;
	public menuPlanner = false;

	public getBlockMenu() {
		return this.blockMenu;
	}

	public setBlockMenu(value) {
		this.blockMenu = value;
	}
}
