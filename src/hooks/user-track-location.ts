import { ACTION_TYPES, StoreContext } from '@/store/store-context';
import { useContext, useState } from 'react';

const useTrackLocation = () => {
	const [locationErrorMsg, setLocationErrorMsg] = useState<string>('');
	// const [latLong, setLatLong] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { dispatch } = useContext(StoreContext);

	const success = (position: GeolocationPosition) => {
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;

		dispatch({
			type: ACTION_TYPES.SET_LAT_LONG,
			payload: { latLong: `${latitude},${longitude}` },
		});
		setLocationErrorMsg('');
		setIsLoading(false);
	};

	const error = () => {
		setLocationErrorMsg('Unable to retrieve your location');
		setIsLoading(false);
	};

	const handleTrackLocaton = () => {
		setIsLoading(true);

		if (!navigator.geolocation) {
			setLocationErrorMsg('Geolocation is not supported by your browser');
		} else {
			navigator.geolocation.getCurrentPosition(success, error, {
				timeout: 10000,
			});
		}
	};

	return {
		locationErrorMsg,
		isLoading,
		handleTrackLocaton,
	};
};

export default useTrackLocation;
