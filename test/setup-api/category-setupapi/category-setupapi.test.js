(function () {
	angular.module('setup.test').controller('categorySetupTestController', categorySetupTestController);

	categorySetupTestController.$inject = ['$scope', 'categorySetupAPIService'];

	function categorySetupTestController($scope, categorySetupAPIService) {

		$scope.dados = {

		};
		
		categorySetupAPIService.getCategoryName(id, (result) => {
			
		}) {

		}
		console.log(categorySetupAPIService);
	}
})();