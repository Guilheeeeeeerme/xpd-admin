(function() {

	'use strict';

	angular.module('xpd-spinner', ['angularSpinner']);

	angular.module('xpd-spinner').config(spinnerConfig);
	angular.module('xpd-spinner').factory('httpInterceptor', httpInterceptor);

	spinnerConfig.$inject = ['$httpProvider', 'usSpinnerConfigProvider'];

	function spinnerConfig($httpProvider, usSpinnerConfigProvider) {

		if(!document.getElementById('xpd-spinner')){
			document.body.innerHTML += '<span us-spinner spinner-key="xpd-spinner"></span>';
		}

    	$httpProvider.interceptors.push('httpInterceptor');

    	usSpinnerConfigProvider.setDefaults({
    		color: 'white'
    	});

	}


	httpInterceptor.$inject = ['$q','usSpinnerService'];

	function httpInterceptor($q, usSpinnerService) {

	    var numLoadings = 0;

	    return {
	        request: function (config) {

	            numLoadings++;

	            //console.log('Show loader');
	            usSpinnerService.spin('xpd-spinner');
	            return config || $q.when(config);

	        },
	        response: function (response) {

	            if ((--numLoadings) === 0) {
	                //console.log('Hide loader');
	                usSpinnerService.stop('xpd-spinner');
	            }

	            return response || $q.when(response);

	        },
	        responseError: function (response) {

	            if (!(--numLoadings)) {
	                //console.log('Hide loader');
	                usSpinnerService.stop('xpd-spinner');
	            }

	            return $q.reject(response);
	        }
	    };
	}


})();
