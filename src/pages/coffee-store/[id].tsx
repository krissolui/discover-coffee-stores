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
	const [votingCount, setVotingCount] = useState<number>(1);

	const {
		state: { coffeeStores },
	} = useContext(StoreContext);

	const handleCreateCoffeeStore = async (coffeeStore: CoffeeStore) => {
		try {
			const res = await fetch('/api/createCoffeeStore', {
				method: 'POST',
				body: JSON.stringify(coffeeStore),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const dbCoffeeStore = await res.json();
		} catch (ex) {
			console.error(ex);
		}
	};

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

	const handleUpvoteButton = () => {
		console.log('handle upvote button');
		setVotingCount(votingCount + 1);
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
						<p className={styles.text}>{votingCount}</p>
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
