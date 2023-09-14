import Head from 'next/head';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';

import Banner from '@/components/banner';
import Card from '@/components/card';

import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { CoffeeStore, fetchCoffeeStores } from '../lib/coffee-stores';
import useTrackLocation from '../hooks/user-track-location';
import { useContext, useEffect, useState } from 'react';
import { ACTION_TYPES, StoreContext } from '@/store/store-context';

const inter = Inter({ subsets: ['latin'] });

export const getStaticProps = (async (context) => {
	let coffeeStores: CoffeeStore[] = [];
	try {
		coffeeStores = await fetchCoffeeStores();
	} catch (ex) {}
	return {
		props: {
			coffeeStores: coffeeStores,
		},
	};
}) satisfies GetStaticProps;

export default function Home(
	props: InferGetStaticPropsType<typeof getStaticProps>
) {
	const [coffeeStoresError, setCoffeeStoresError] = useState<string | null>(
		null
	);
	const { dispatch, state } = useContext(StoreContext);
	const { coffeeStores, latLong } = state;

	const { handleTrackLocaton, locationErrorMsg, isLoading } =
		useTrackLocation();

	useEffect(() => {
		const fetchCustomCoffeeStores = async () => {
			if (latLong?.length > 0) {
				try {
					const res = await fetch(
						`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=${30}`
					);
					const { coffeeStores } = await res.json();

					dispatch({
						type: ACTION_TYPES.SET_COFFEE_STORES,
						payload: { coffeeStores },
					});
					setCoffeeStoresError('');
				} catch (ex: any) {
					setCoffeeStoresError(ex?.message);
				}
			}
		};
		fetchCustomCoffeeStores();
	}, [latLong]);

	const handleOnClickBanner = () => {
		if (isLoading) return;
		handleTrackLocaton();
	};

	return (
		<>
			<Head>
				<title>Coffee Connoisseur</title>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={`${styles.main} ${inter.className}`}>
				<Banner
					buttonText={isLoading ? 'Loading...' : 'View stores nearby'}
					handleOnClick={handleOnClickBanner}
				/>
				{locationErrorMsg.length > 0 && (
					<p>somethings went wrong: {locationErrorMsg}</p>
				)}
				{coffeeStoresError && (
					<p>somethings went wrong: {coffeeStoresError}</p>
				)}
				<Image
					className={styles.heroImage}
					src="/static/hero.png"
					width={700}
					height={400}
					alt=""
				/>

				{coffeeStores?.length > 0 && (
					<>
						<h2 className={styles.heading2}>Stores near me</h2>

						<div className={styles.cardLayout}>
							{coffeeStores.map((coffeeStore) => {
								return (
									<Card
										className={styles.card}
										key={coffeeStore.id}
										name={coffeeStore.name}
										imgUrl={coffeeStore.imgUrl}
										href={`/coffee-store/${coffeeStore.id}`}
									/>
								);
							})}
						</div>
					</>
				)}
				{props.coffeeStores.length > 0 && (
					<>
						<h2 className={styles.heading2}>Mississauga stores</h2>

						<div className={styles.cardLayout}>
							{props.coffeeStores.map((coffeeStore) => {
								return (
									<Card
										className={styles.card}
										key={coffeeStore.id}
										name={coffeeStore.name}
										imgUrl={coffeeStore.imgUrl}
										href={`/coffee-store/${coffeeStore.id}`}
									/>
								);
							})}
						</div>
					</>
				)}
			</main>
		</>
	);
}
