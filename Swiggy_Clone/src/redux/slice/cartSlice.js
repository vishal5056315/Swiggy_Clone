import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	items: [],
};
const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addToCart: (state, action) => {
			const itemIdx = state.items.findIndex(
				el => el.info.id === action.payload.info.id
			);
			if (itemIdx < 0) {
				state.items.push(action.payload);
			} else {
				state.items[itemIdx].quantity =
					state.items[itemIdx].quantity + 1;
			}
		},
		clearCart: state => {
			state.items = [];
		},
		updateCart: (state, action) => {
			state.items = action.payload;
		},
		removeFromCart: (state, action) => {
			state.items = state.items.filter(
				el => el.info.id !== action.payload
			);
		},
		increaseQuantity: (state, action) => {
			const item = state.items.find(el => el.info.id === action.payload);
			item.quantity = item.quantity + 1;
		},
		decreaseQuantity: (state, action) => {
			const item = state.items.find(el => el.info.id === action.payload);
			item.quantity = item.quantity - 1;
		},
	},
});

export const {
	addToCart,
	clearCart,
	updateCart,
	removeFromCart,
	increaseQuantity,
	decreaseQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
