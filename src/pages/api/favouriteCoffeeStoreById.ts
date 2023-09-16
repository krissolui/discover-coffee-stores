import {
	findCoffeeStoreRecord,
	recordToCoffeeStore,
	updateCoffeeStoreRecord,
} from '@/lib/airtable';
import { CoffeeStore } from '@/lib/coffee-stores';
import { NextApiRequest, NextApiResponse } from 'next';

type Error = {
	message: string;
	error?: any;
};

const favouriteCoffeeStoreById = async (
	req: NextApiRequest,
	res: NextApiResponse<CoffeeStore | Error>
) => {
	if (req.method !== 'PUT') {
		res.status(404).json({ message: 'path not found' });
	}
	const { id }: { id?: string } = req.body;

	if (!id) {
		res.status(400).json({ message: 'id is required' });
		return;
	}

	let votes: number;
	let recordId: string;
	try {
		const record = await findCoffeeStoreRecord(id);
		if (!record) {
			res.status(400).json({ message: 'coffee store not found' });
			return;
		}
		const coffeeStore = recordToCoffeeStore(record);
		votes = (coffeeStore.votes ?? 0) + 1;
		recordId = record.id;
	} catch (ex) {
		res.status(500).json({ message: 'failed to find store', error: ex });
		return;
	}

	try {
		const record = await updateCoffeeStoreRecord(recordId, id, votes);
		if (!record) throw 'failed to update store';

		res.status(200).json(recordToCoffeeStore(record));
	} catch (ex) {
		res.status(500).json({ message: 'failed to update store', error: ex });
		return;
	}
};

export default favouriteCoffeeStoreById;
