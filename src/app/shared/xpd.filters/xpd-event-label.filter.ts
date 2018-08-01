const XPDEventLabelFilter = ($filter) => {
	return (event) => {

		if (event && event.toLowerCase && event.toLowerCase() === 'trip') {
			return 'Trip';
		}

		if (event && event.toLowerCase && event.toLowerCase() === 'conn') {
			return 'Connection';
		}

		if (event && event.toLowerCase && event.toLowerCase() === 'time') {
			return 'Time Procedure';
		}

		return 'Unknown Slips Condition';
	};

};

XPDEventLabelFilter.$inject = ['$filter'];

export { XPDEventLabelFilter };
