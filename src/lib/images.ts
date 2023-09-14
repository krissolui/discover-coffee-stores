import { createApi } from 'unsplash-js';

const unsplash = createApi({
	accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY ?? '',
});

export const fetchCoffeeStoresImages = async (
	query: string,
	perPage: number
) => {
	const res = await unsplash.search.getPhotos({
		query,
		perPage,
	});

	if (res.type !== 'success') return [];

	return res.response?.results.map((result) => result.urls.small);
};
