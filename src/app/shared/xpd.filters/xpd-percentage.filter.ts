
const XPDPercentageFilter = ($filter) => {
	return (input, decimals) => {
		return $filter('number')(input * 100, decimals) + '%';
	};
};

XPDPercentageFilter.$inject = ['$filter'];

export { XPDPercentageFilter };
