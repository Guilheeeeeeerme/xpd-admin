
const XPDStateLabelFilter = ($filter) => {
	return (state) => {
		switch (state) {

			case 'makeUp':
				return 'Make Up';
			case 'layDown':
				return 'Lay Down';
			case 'cased':
				return 'Cased Well';
			case 'drilling':
				return 'Drilling';
			case 'openSea':
				return 'Open Sea';
			case 'openHole':
				return 'Open Hole';
			case 'inBreakDPInterval':
				return 'In Break DP Interval';
			case 'casing':
				return 'Casing';
			case 'settlementString':
				return 'Settlement String';
			case 'belowShoeDepth':
				return 'Below Shoe Depth';
			case 'cementation':
				return 'Cementation';
			case 'ascentRiser':
				return 'Ascent Riser';
			case 'descendRiser':
				return 'Descend Riser';
			case 'time':
				return 'Time';
			default:
				return 'Not Found!';
		}

	};

};

XPDStateLabelFilter.$inject = ['$filter'];

export { XPDStateLabelFilter };
