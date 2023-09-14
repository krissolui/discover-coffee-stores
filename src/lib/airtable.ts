import Airtable from 'airtable';
import { CoffeeStore } from './coffee-stores';
Airtable.configure({
	endpointUrl: 'https://api.airtable.com',
	apiKey: process.env.AIRTABLE_API_KEY ?? '',
});
const base = Airtable.base(process.env.AIRTABLE_BASE ?? '');
const table = base('coffee-stores');

export const findCoffeeStoreRecords = async (id: string) => {
	return await table
		.select({
			filterByFormula: `id="${id}"`,
		})
		.firstPage();
};

export const createCoffeeStoreRecord = async (coffeeStore: CoffeeStore) => {
	return await table.create([
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
