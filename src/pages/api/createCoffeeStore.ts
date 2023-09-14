import {
	createCoffeeStoreRecord,
	findCoffeeStoreRecords,
} from '@/lib/airtable';
import { CoffeeStore } from '@/lib/coffee-stores';
import { NextApiRequest, NextApiResponse } from 'next';

type Error = {
	message: string;
	error?: any;
};

const createCoffeeStore = async (
	req: NextApiRequest,
	res: NextApiResponse<CoffeeStore | Error>
) => {
	if (req.method !== 'POST') {
		res.status(404).json({ message: 'path not found' });
		return;
	}

	const body: CoffeeStore = req.body;

	if (!body.id) {
		res.status(400).json({ message: 'id is required' });
		return;
	}

	try {
		const records = await findCoffeeStoreRecords(body.id);
		if (records.length > 0) {
			res.json(records[0].fields as CoffeeStore);
			return;
		}
	} catch (ex) {
		res.status(500).json({ message: 'failed to find store', error: ex });
	}

	if (!body.name) {
		res.status(400).json({ message: 'name is required' });
		return;
	}

	try {
		const records = await createCoffeeStoreRecord(body);
		res.json(records[0].fields as CoffeeStore);
	} catch (ex) {
		res.status(500).json({ message: 'failed to create store', error: ex });
	}
};

export default createCoffeeStore;
