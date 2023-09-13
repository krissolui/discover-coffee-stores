import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '@/styles/CoffeeStore.module.css';

import Image from 'next/image';
import classNames from 'classnames';
import { fetchCoffeeStores } from '../../../lib/coffee-stores';

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
	return {
		props: {
			coffeeStore: coffeeStores.find((coffeeStore) => {
				return coffeeStore.id === params?.id;
			}),
		},
	};
}) satisfies GetStaticProps;

const CoffeeStore = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
	const router = useRouter();

	if (router.isFallback) return <div>Loading...</div>;

	const { address, name, neighbourhood, imgUrl } = { ...props.coffeeStore };

	const handleUpvoteButton = () => {
		console.log('handle upvote button');
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
					{/* <div className={styles.storeImgWrapper}> */}
					<Image
						className={styles.storeImg}
						src={imgUrl ?? ''}
						width={600}
						height={360}
						alt={name ?? ''}
					/>
					{/* </div> */}
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
						<p className={styles.text}>{1}</p>
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
