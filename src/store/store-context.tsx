import { CoffeeStore } from '@/lib/coffee-stores';
import { PropsWithChildren, createContext, useReducer } from 'react';
export enum ACTION_TYPES {
	SET_LAT_LONG = 'SET_LAT_LONG',
	SET_COFFEE_STORES = 'SET_COFFEE_STORES',
}

interface IStoreAction {
	type: ACTION_TYPES;
	payload: any;
}

interface IStoreState {
	latLong: string;
	coffeeStores: CoffeeStore[];
}

const initialState: IStoreState = {
	latLong: '',
	coffeeStores: [],
};

export const StoreContext = createContext<{
	state: IStoreState;
	dispatch: React.Dispatch<any>;
}>({
	state: initialState,
	dispatch: () => null,
});

const storeReducer = (state: IStoreState, action: IStoreAction) => {
	switch (action.type) {
		case ACTION_TYPES.SET_LAT_LONG: {
			return { ...state, latLong: action.payload.latLong };
		}
		case ACTION_TYPES.SET_COFFEE_STORES: {
			return { ...state, coffeeStores: action.payload.coffeeStores };
		}
		default:
			throw new Error(`Unhandled action type: ${action.type}`);
	}
};

export const StoreProvider = ({ children }: PropsWithChildren) => {
	const [state, dispatch] = useReducer(storeReducer, initialState);

	return (
		<StoreContext.Provider value={{ state, dispatch }}>
			{children}
		</StoreContext.Provider>
	);
};
