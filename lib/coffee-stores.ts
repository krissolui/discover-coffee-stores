import { fetchCoffeeStoresImages } from './images';

export type CoffeeStore = {
	id: string;
	name: string;
	imgUrl: string;
	websiteUrl?: string;
	address?: string;
	neighbourhood: string;
};

const getCoffeeStoresURL = (
	latLong: string,
	query: string,
	limit: number
): string => {
	return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${encodeURIComponent(
		latLong
	)}&limit=${limit}`;
};

export const fetchCoffeeStores = async (): Promise<CoffeeStore[]> => {
	const numOfStores = 6;
	const images = await fetchCoffeeStoresImages('coffee shop', numOfStores);

	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: process.env.FSQ_API_KEY ?? '',
		},
	};

	try {
		const response = await fetch(
			getCoffeeStoresURL(
				'43.602939511796414,-79.64792594923955',
				'coffee',
				numOfStores
			),
			options
		);
		const data = await response.json();
		return data.results.map((coffeeStore: any, i: number) => {
			const neighbourhood = coffeeStore.location.neighbourhood;
			return {
				id: coffeeStore.fsq_id,
				name: coffeeStore.name,
				imgUrl: images?.[i] ?? '',
				address: coffeeStore.location.address,
				neighbourhood:
					neighbourhood?.length > 0 ? neighbourhood[0] : null,
			};
		});
	} catch (err) {
		console.error(err);
		return [];
	}
};
