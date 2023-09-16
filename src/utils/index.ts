export const isEmpty = (obj: any): boolean => {
	if (!obj) return true;

	switch (typeof obj) {
		case 'string': {
			if (obj !== '') return false;
			break;
		}
		case 'number': {
			if (obj !== 0) return false;
			break;
		}
		case 'object': {
			for (const value of Object.values(obj)) {
				if (!isEmpty(value)) return false;
			}
			break;
		}
	}

	return true;
};
