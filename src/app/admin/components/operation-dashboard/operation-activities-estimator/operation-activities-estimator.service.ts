export class OperationActivitiesEstimatorService {

	public estimateNextActivities(startAt, estimatives): any[] {

		const nextActivities = [];

		// tslint:disable-next-line:prefer-for-of
		for (let index = 0;
			index < estimatives.length;
			index++) {

			try {

				const estimative = estimatives[index];

				const state = Object.keys(estimative)[0];
				let startTime = startAt;
				const duration = (estimative[state].BOTH.finalTime * 1000);

				if (nextActivities.length > 0) {
					startTime = nextActivities[nextActivities.length - 1].finalTime;
				}

				const activity = {
					name: state,
					alarms: estimative[state].alarms,
					duration,
					startTime,
					finalTime: (startTime + duration),
					isTripin: estimative[state].isTripin,
				};

				nextActivities.push(activity);

			} catch (error) {
				console.error(error);
			}

		}

		return nextActivities;

	}

}
