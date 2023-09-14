export const isEmpty = (obj: any): boolean => {
	if (Object.keys(obj).length === 0) return true;
	Object.values(obj).forEach((value) => {
		switch (typeof value) {
			case 'string': {
				if (value !== '') return false;
				break;
			}
			case 'number': {
				if (value !== 0) return false;
				break;
			}
			case 'object': {
				if (!isEmpty(value)) return false;
				break;
			}
		}
	});

	return true;
};
