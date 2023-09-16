import Airtable, { FieldSet, Record } from 'airtable';
import { CoffeeStore } from './coffee-stores';

Airtable.configure({
	endpointUrl: 'https://api.airtable.com',
	apiKey: process.env.AIRTABLE_API_KEY ?? '',
});
const base = Airtable.base(process.env.AIRTABLE_BASE ?? '');
const table = base('coffee-stores');

export const findCoffeeStoreRecord = async (
	id: string
): Promise<Record<FieldSet> | null> => {
	try {
		const records = await table
			.select({
				filterByFormula: `id="${id}"`,
			})
			.firstPage();

		records[0]?.id;
		if (records.length === 0) return null;
		return records[0];
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

export const updateCoffeeStoreRecord = async (
	recordId: string,
	id: string,
	votes: number
): Promise<Record<FieldSet> | null> => {
	try {
		const records = await table.update([
			{
				id: recordId,
				fields: {
					id: id,
					votes: votes,
				},
			},
		]);

		if (records.length === 0) return null;
		return records[0];
	} catch (ex) {
		return null;
	}
};

export const recordToCoffeeStore = (record: Record<FieldSet>): CoffeeStore => {
	return record.fields as CoffeeStore;
};
