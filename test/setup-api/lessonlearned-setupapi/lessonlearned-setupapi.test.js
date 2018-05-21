(function () {
	angular.module('setup.test').controller('lessonLearnedSetupTestController', lessonLearnedSetupTestController);

	lessonLearnedSetupTestController.$inject = ['$scope', 'lessonLearnedSetupAPIService'];

	function lessonLearnedSetupTestController($scope, lessonLearnedSetupAPIService) {

		$scope.data = {
			responseList: []
		};

		runTest();

		function runTest() {
			insertLessonLearned();
		}

		function insertLessonLearned() {
			var lessonLearned = {
				bestPractices: false,
				description: "LESSON TESTE",
				endTime: "2018-05-18T13:00:00.000Z",
				lessonLearnedCategory: { id: 1 },
				operation: { id: 5 },
				startTime: "2018-05-18T12:00:00.000Z",
			}

			lessonLearnedSetupAPIService.insertObject(lessonLearned,
				(result) => successCallback(result, 'insertObject', updateLessonLearned),
				(error) => errorCallback(error, 'insertObject')
			);
		}

		function updateLessonLearned(ll) {
			var lessonLearned = angular.copy(ll);
			lessonLearned.description = "LESSON TESTE EDITADA";
			lessonLearned.bestPractices = true;
			lessonLearned.operation = { id: 5 };

			lessonLearnedSetupAPIService.updateObject(lessonLearned,
				(result) => successCallback(result, 'updateObject', listLessonLearned),
				(error) => errorCallback(error, 'updateObject')
			);
		}

		function listLessonLearned(lessonLearned) {
			lessonLearnedSetupAPIService.getList(
				(result) => successCallback(result, 'getList', removeLessonLearned),
				(error) => errorCallback(error, 'getList')
			);
		}

		function removeLessonLearned(lessonsLearned) {
			lessonLearnedSetupAPIService.removeObject(lessonsLearned[0],
				(result) => successCallback(result, 'removeObject', runCategoryTest),
				(error) => errorCallback(error, 'removeObject')
			);
		}

		// LESSON LEARNED CATEGORY
		function runCategoryTest() {
			insertLessonLearnedCategory();
			getListLessonLearnedCategory();
		}

		function insertLessonLearnedCategory() {
			var category = {
				initial: 'C01',
				name: 'category 1',
				parentId: 1,
			};

			lessonLearnedSetupAPIService.insertCategory(
				category,
				(result) => successCallback(result, 'insertCategory', updateLessonLearnedCategory),
				(error) => errorCallback(error, 'insertCategory')
			);
		}

		function updateLessonLearnedCategory(category) {
			var category = angular.copy(category);
			
			category.initial = 'C02';
			category.name = 'category 2';

			lessonLearnedSetupAPIService.updateCategory(category,
				(result) => successCallback(result, 'updateCategory', removeLessonLearnedCategory),
				(error) => errorCallback(error, 'updateCategory')
			);
		}

		function removeLessonLearnedCategory(category) {
			lessonLearnedSetupAPIService.removeCategory(category,
				(result) => successCallback(result, 'removeCategory'),
				(error) => errorCallback(error, 'removeCategory')
			);
		}

		function getListLessonLearnedCategory() {
			lessonLearnedSetupAPIService.getListCategory(
				(result) => successCallback(result, 'getListCategory'),
				(error) => errorCallback(error, 'getListCategory')
			);
		}

		function successCallback(result, method, nextTest) {

			$scope.data.responseList.push({
				method: method,
				code: 200,
				status: 'success',
				data: result,
			});

			nextTest && nextTest(result);
		}

		function errorCallback(error, method) {
			error.data.method = method;
			$scope.data.responseList.push(error.data);
		}
	}
})();