import styles from '@/styles/Banner.module.css';
import classNames from 'classnames';
import { AppProps } from 'next/app';
import Image from 'next/image';

interface IBannerProps {
	buttonText: string;
	handleOnClick: () => void;
}
const Banner = (props: IBannerProps) => {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>
				<span className={styles.title1}>Coffee</span>
				<span className={styles.title2}>Connoisseur</span>
			</h1>
			<p className={styles.subTitle}>Discover your local coffee shops!</p>

			<button
				className={classNames(styles.button, styles.buttonWrapper)}
				onClick={props.handleOnClick}
			>
				{props.buttonText}
			</button>
		</div>
	);
};
export default Banner;
