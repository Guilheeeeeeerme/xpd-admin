/*
* @Author: Gezzy Ramos
* @Date:   2017-05-15 17:09:13
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-05-16 17:35:49
*/
(function (){
	'use strict';

	angular.module('xpd.menu-confirmation')
		.factory('menuConfirmationFactory', menuConfirmationFactory);

	menuConfirmationFactory.$inject = [];

	function menuConfirmationFactory() {

		var vm = this;
		vm.blockMenu = false;
		vm.menuPlanner = false;


		return {
			getBlockMenu: getBlockMenu,
			setBlockMenu: setBlockMenu,
		};

		function getBlockMenu(){
			return vm.blockMenu;
		}

		function setBlockMenu(value){
			vm.blockMenu = value;
		}
	}
})();