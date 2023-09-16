import { findCoffeeStoreRecord, recordToCoffeeStore } from '@/lib/airtable';
import { CoffeeStore, fetchCoffeeStores } from '@/lib/coffee-stores';
import { NextApiRequest, NextApiResponse } from 'next';

type Error = {
	message: string;
	error?: any;
};

const getCoffeeStoreById = async (
	req: NextApiRequest,
	res: NextApiResponse<CoffeeStore | Error>
) => {
	const { id }: { id?: string } = req.query;
	if (!id) {
		res.status(400).json({ message: 'id is required' });
		return;
	}

	try {
		const record = await findCoffeeStoreRecord(id);
		if (!record) {
			res.status(400).json({ message: 'coffee store not found' });
			return;
		}

		res.json(recordToCoffeeStore(record));
	} catch (ex) {
		res.status(500).json({ message: 'failed to find store', error: ex });
	}
};

export default getCoffeeStoreById;
