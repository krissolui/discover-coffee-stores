import Image from 'next/image';
import Link from 'next/link';
import classNames from 'classnames';
import styles from '@/styles/Card.module.css';

interface ICardProps {
	className?: string;
	name: string;
	imgUrl: string;
	href: string;
}

const Card = (props: ICardProps) => {
	return (
		<Link className={styles.cardLink} href={props.href}>
			<div className={classNames('glass', styles.container)}>
				<div className={styles.cardLinkWrapper}>
					<h2 className={styles.cardHeader}>{props.name}</h2>
				</div>
				<div className={styles.cardImageWrapper}>
					<Image
						className={styles.cardImage}
						src={props.imgUrl}
						width={260}
						height={160}
						alt={props.name}
					/>
				</div>
			</div>
		</Link>
	);
};

export default Card;
