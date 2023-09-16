import { fetchCoffeeStoresImages } from './images';

export type CoffeeStore = {
	id: string;
	name: string;
	imgUrl: string;
	websiteUrl?: string;
	address?: string;
	neighbourhood?: string;
	votes?: number;
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

export const fetchCoffeeStores = async (
	latLong: string = '43.602939511796414,-79.64792594923955',
	limit: number = 6
): Promise<CoffeeStore[]> => {
	const images = await fetchCoffeeStoresImages('coffee shop', limit);

	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: process.env.NEXT_PUBLIC_FSQ_API_KEY ?? '',
		},
	};

	try {
		const response = await fetch(
			getCoffeeStoresURL(latLong, 'coffee', limit),
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
