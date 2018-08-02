// (function() {
// 	'use strict';

// 		.service('vCruisingCalculator', vCruisingCalculator);

export class VCruisingCalculatorService {

	public calculate(targetSpeed, time, accelerationTimeLimit, decelerationTimeLimit) {
		let vcruising;

		if ((accelerationTimeLimit + decelerationTimeLimit) > 0) { // EQUAÇÃO DO ROBSON, DEU CERTO.
			vcruising = (2 * time * targetSpeed) / (2 * time - (accelerationTimeLimit + decelerationTimeLimit));
		} else {
			vcruising = targetSpeed;
		} // VELOCIDADE UNIFORME CASO NÃO EXISTE ACCELERATION TIME

		return vcruising;
	}

}

// })();
