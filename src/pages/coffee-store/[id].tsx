import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '@/styles/CoffeeStore.module.css';

import Image from 'next/image';
import classNames from 'classnames';
import { CoffeeStore, fetchCoffeeStores } from '@/lib/coffee-stores';
import { useContext, useEffect, useState } from 'react';
import { isEmpty } from '@/utils';
import { StoreContext } from '@/store/store-context';
import useSWR from 'swr';

export const getStaticPaths = (async () => {
	const coffeeStores = await fetchCoffeeStores();
	const paths = coffeeStores.map((coffeeStore) => {
		return {
			params: {
				id: coffeeStore.id,
			},
		};
	});

	return {
		paths,
		fallback: true,
	};
}) satisfies GetStaticPaths;

export const getStaticProps = (async (context) => {
	const coffeeStores = await fetchCoffeeStores();
	const params = context.params;
	const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
		return coffeeStore.id === params?.id;
	});

	return {
		props: {
			coffeeStore: findCoffeeStoreById ?? {
				id: '',
				name: '',
				imgUrl: '',
			},
		},
	};
}) satisfies GetStaticProps;

const CoffeeStore = (
	initialProps: InferGetStaticPropsType<typeof getStaticProps>
) => {
	const router = useRouter();

	if (router.isFallback) return <div>Loading...</div>;

	const id = router.query.id;
	const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

	const fetcher = (url: string) =>
		fetch(url).then(async (res) => {
			if (res.ok) return res.json();
			throw await res.json();
		});
	const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

	const {
		state: { coffeeStores },
	} = useContext(StoreContext);

	useEffect(() => {
		if (data) setCoffeeStore(data as CoffeeStore);
	}, [data]);

	useEffect(() => {
		const handler = async () => {
			if (!isEmpty(initialProps.coffeeStore)) {
				await handleCreateCoffeeStore(initialProps.coffeeStore);
				return;
			}

			const coffeeStoreFromContext = coffeeStores.find(
				(coffeeStore) => coffeeStore.id === id
			);

			if (!coffeeStoreFromContext) return;
			setCoffeeStore(coffeeStoreFromContext);
			await handleCreateCoffeeStore(coffeeStoreFromContext);
		};
		handler();
	}, [id]);

	const { address, name, neighbourhood, imgUrl } = {
		...coffeeStore,
	};

	const handleCreateCoffeeStore = async (coffeeStore: CoffeeStore) => {
		try {
			const res = await fetch('/api/createCoffeeStore', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(coffeeStore),
			});
			const dbCoffeeStore = await res.json();
		} catch (ex) {}
	};

	const handleUpvoteButton = async () => {
		try {
			const res = await fetch('/api/favouriteCoffeeStoreById', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id }),
			});
			const dbCoffeeStore = await res.json();
			if (!res.ok) throw dbCoffeeStore;

			setCoffeeStore(dbCoffeeStore);
		} catch (ex) {}
	};

	return (
		<div className={styles.layout}>
			<Head>
				<title>{name}</title>
			</Head>

			<div className={styles.container}>
				<div className={styles.col1}>
					<div className={styles.backToHomeLink}>
						<Link href="/">← Back to Home</Link>
					</div>
					<div className={styles.nameWrapper}>
						<h1 className={styles.name}>{name}</h1>
					</div>
					<Image
						className={styles.storeImg}
						src={imgUrl ?? ''}
						width={600}
						height={360}
						alt={name ?? ''}
					/>
				</div>

				<div className={classNames('glass', styles.col2)}>
					{address && (
						<div className={styles.iconWrapper}>
							<Image
								src="/static/icons/places.svg"
								width={24}
								height={24}
								alt={address ?? ''}
							/>
							<p className={styles.text}>{address}</p>
						</div>
					)}
					{neighbourhood && (
						<div className={styles.iconWrapper}>
							<Image
								src="/static/icons/nearMe.svg"
								width={24}
								height={24}
								alt={neighbourhood ?? ''}
							/>
							<p className={styles.text}>{neighbourhood}</p>
						</div>
					)}
					<div className={styles.iconWrapper}>
						<Image
							src="/static/icons/star.svg"
							width={24}
							height={24}
							alt={'1' ?? ''}
						/>
						<p className={styles.text}>{coffeeStore.votes ?? 0}</p>
					</div>

					<button
						className={styles.upvoteButton}
						onClick={handleUpvoteButton}
					>
						Upvote
					</button>
				</div>
			</div>
		</div>
	);
};

export default CoffeeStore;
