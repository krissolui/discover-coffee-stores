import { StoreProvider } from '@/store/store-context';
import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<StoreProvider>
				<Component {...pageProps} />
			</StoreProvider>
			<footer>@2023 Kris Lui</footer>
			<Analytics />
		</>
	);
}
