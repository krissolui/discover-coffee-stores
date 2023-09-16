import Airtable from 'airtable';
import { CoffeeStore } from './coffee-stores';
Airtable.configure({
	endpointUrl: 'https://api.airtable.com',
	apiKey: process.env.AIRTABLE_API_KEY ?? '',
});
const base = Airtable.base(process.env.AIRTABLE_BASE ?? '');
const table = base('coffee-stores');

export const findCoffeeStoreRecord = async (
	id: string
): Promise<CoffeeStore | null> => {
	try {
		const records = await table
			.select({
				filterByFormula: `id="${id}"`,
			})
			.firstPage();

		return (records[0]?.fields as CoffeeStore) ?? null;
	} catch (ex) {
		return null;
	}
};

export const createCoffeeStoreRecord = (coffeeStore: CoffeeStore) => {
	return table.create([
		{
			fields: {
				id: coffeeStore.id,
				name: coffeeStore.name,
				address: coffeeStore.address,
				neighbourhood: coffeeStore.neighbourhood,
				imgUrl: coffeeStore.imgUrl,
				votes: 0,
			},
		},
	]);
};
