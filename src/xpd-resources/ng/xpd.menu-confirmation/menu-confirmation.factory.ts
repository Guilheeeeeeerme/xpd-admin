/*
* @Author: Gezzy Ramos
* @Date:   2017-05-15 17:09:13
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-05-16 17:35:49
// */
// (function() {
// 	'use strict';

// 	angular.module('xpd.menu-confirmation')
// 		.factory('menuConfirmationFactory', menuConfirmationFactory);

// 	menuConfirmationFactory.$inject = [];

export class MenuConfirmationFactory {

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

	// })();
