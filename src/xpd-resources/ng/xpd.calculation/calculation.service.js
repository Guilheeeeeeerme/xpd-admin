(function () {
	'use strict';

	angular.module('xpd.calculation')
		.service('vCruisingCalculator', vCruisingCalculator);

	function vCruisingCalculator() {

	    var vm = this;

	    this.calculate = calculate;

	    function calculate(targetSpeed, time, accelerationTimeLimit, decelerationTimeLimit) {
	        var vcruising;

	        if ((accelerationTimeLimit + decelerationTimeLimit) > 0) // EQUAÇÃO DO ROBSON, DEU CERTO.
	            vcruising = (2 * time * targetSpeed) / (2 * time - (accelerationTimeLimit + decelerationTimeLimit));
	        else
	            vcruising = targetSpeed; // VELOCIDADE UNIFORME CASO NÃO EXISTE ACCELERATION TIME

	        return vcruising;
	    }

	}
	
})();