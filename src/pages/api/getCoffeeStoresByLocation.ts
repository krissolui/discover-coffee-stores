import { CoffeeStore, fetchCoffeeStores } from '@/lib/coffee-stores';
import { NextApiRequest, NextApiResponse } from 'next';

type CoffeeStoresData = {
	coffeeStores: CoffeeStore[];
};

type Error = {
	message: string;
	error: any;
};

const getCoffeeStoresByLocation = async (
	req: NextApiRequest,
	res: NextApiResponse<CoffeeStoresData | Error>
) => {
	const { latLong, limit }: { latLong?: string; limit?: number } = req.query;
	try {
		const coffeeStores = await fetchCoffeeStores(latLong, limit);
		res.status(200).json({ coffeeStores });
	} catch (ex) {
		res.status(500).json({
			message: 'failed to fetch coffee stores',
			error: ex,
		});
	}
};

export default getCoffeeStoresByLocation;
