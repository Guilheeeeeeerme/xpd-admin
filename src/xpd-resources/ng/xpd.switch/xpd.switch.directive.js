(function(){
	'use strict';

	angular.module('xpd.switch', [])
		.directive('xpdSwitch', xpdSwitch);
    
	function xpdSwitch(){
        
		return {
			restrict: 'E',
			scope:{
				shape: '@',
				resolve: '&',
				reject: '&',
				ngModel: '='
			},
			templateUrl: '../xpd-resources/ng/xpd.switch/xpd.switch.template.html',
			link: link
		};

		function link(scope, elem, attrs){

			scope.onSwitchChange = onSwitchChange;

			function onSwitchChange(){
				try{

					if(scope.ngModel == true){
						scope.resolve();
					}else{
						scope.reject();
					}

				}catch(e){

				}
			}
		}

	}

})();