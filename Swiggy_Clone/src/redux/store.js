import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slice/cartSlice';
import searchReducer from './slice/searchSlice';
import authReducer from './slice/authSlice';
import loginReducer from './slice/loginSlice';

const store = configureStore({
	reducer: {
		cart: cartReducer,
		search: searchReducer,
		auth: authReducer,
		loginBools: loginReducer,
	},
});

export default store;
