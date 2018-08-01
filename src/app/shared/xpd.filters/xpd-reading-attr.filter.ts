
const XPDReadingAttrFilter = ($filter) => {
	return (attribute) => {
		switch (attribute) {
			case 'rpm':
				return 'RPM';
			case 'wob':
				return 'WOB';
			case 'flow':
				return 'Flow';
			case 'rop':
				return 'ROP';
			case 'torque':
				return 'Torque';
			case 'depth':
				return 'Depth';
			case 'blockPosition':
				return 'Block Position';
			case 'hookload':
				return 'Hook Load';
			case 'sppa':
				return 'SPPA';
			case 'date':
				return 'Date';
			case 'time':
				return 'Time';
			case 'bitDepth':
				return 'Bit Depth';
			case 'blockSpeed':
				return 'Block Speed';
			case 'timestamp':
				return 'Date';
			default:
				return 'Not Found!';
		}
	};
};

XPDReadingAttrFilter.$inject = ['$filter'];

export { XPDReadingAttrFilter };
