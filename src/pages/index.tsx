import Head from 'next/head';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';

import Banner from '@/components/banner';
import Card from '@/components/card';

// import coffeeStoresData from '../../data/coffee-stores.json';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { CoffeeStore, fetchCoffeeStores } from '../../lib/coffee-stores';

const inter = Inter({ subsets: ['latin'] });

export const getStaticProps = (async (context) => {
	let coffeeStoresData: CoffeeStore[] = [];
	try {
		coffeeStoresData = await fetchCoffeeStores();
	} catch (ex) {}
	return {
		props: {
			coffeeStores: coffeeStoresData,
		},
	};
}) satisfies GetStaticProps;

export default function Home(
	props: InferGetStaticPropsType<typeof getStaticProps>
) {
	const handleOnClickBanner = () => {
		console.log('hi! banner button');
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
					buttonText="View stores nearby"
					handleOnClick={handleOnClickBanner}
				/>
				<Image
					className={styles.heroImage}
					src="/static/hero.png"
					width={700}
					height={400}
					alt=""
				/>

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
