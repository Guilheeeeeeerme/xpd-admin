(function () {
	'use strict';

	angular.module('xpd.modal-lessonlearned').factory('lessonLearnedModal', lessonLearnedModal);
    
	lessonLearnedModal.$inject = ['$uibModal'];

	function lessonLearnedModal($uibModal) {

		return {
			open: open
		};

		function open(selectedLessonLearned, modalSuccessCallback, modalErrorCallback){

			if(selectedLessonLearned.startTime)
				selectedLessonLearned.startTime = new Date(selectedLessonLearned.startTime);

			if(selectedLessonLearned.endTime)
				selectedLessonLearned.endTime = new Date(selectedLessonLearned.endTime);
            
			return $uibModal.open({
				keyboard: false,
				backdrop: 'static',
				templateUrl: '../xpd-resources/ng/xpd.modal.lessonlearned/xpd-modal-lessonlearned.template.html',
				windowClass: 'xpd-operation-modal',
				controller: 'modalLessonLearnedController as mllController',
				size: 'modal-md',
				resolve: {
					selectedLessonLearned: function(){
						return selectedLessonLearned;
					},
					modalSuccessCallback: function(){
						return modalSuccessCallback;
					},
					modalErrorCallback: function(){
						return modalErrorCallback;
					}
				}
			});
		}
        
	}

})();
