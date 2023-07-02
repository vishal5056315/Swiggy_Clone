import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Error from './pages/Error/Error';
import Home from './pages/Home/Home';
import RestaurantPage from './pages/RestaurantPage/RestaurantPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import Offers from './pages/Offers/Offers';
import Search from './pages/Search/Search';
import { useEffect } from 'react';
import { updateCart } from './redux/slice/cartSlice';
import Profile from './pages/Profile/Profile';
import { auth } from './auth/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { login } from './redux/slice/authSlice';

const AppLayout = () => {
	const cart = useSelector(state => state.cart.items);
	const dispatch = useDispatch();
	const setCartToLocalStorage = () => {
		window.localStorage.setItem('sw_cart_data', JSON.stringify(cart));
	};
	const getCartToLocalStorage = () => {
		const cartData = window.localStorage.getItem('sw_cart_data')
			? JSON.parse(window.localStorage.getItem('sw_cart_data'))
			: [];
		dispatch(updateCart(cartData));
	};
	useEffect(() => {
		getCartToLocalStorage();
		onAuthStateChanged(auth, user => {
			if (user) {
				dispatch(
					login({
						displayName: user.displayName,
						email: user.email,
						photoURL: user.photoURL,
						emailVerified: user.emailVerified,
						providerId: user?.providerId,
					})
				);
			}
		});
	}, []);
	useEffect(() => {
		setCartToLocalStorage();
	}, [cart]);

	return (
		<>
			<Header />
			<Outlet />
			<Footer />
			<div
				style={{
					fontSize: '1.5rem',
				}}></div>
		</>
	);
};

const appRouter = createBrowserRouter([
	{
		path: '/',
		element: <AppLayout />,
		errorElement: (
			<>
				<Header />
				<Error />
				<Footer />
			</>
		),
		children: [
			{
				path: '/',
				element: <Home />,
			},
			{
				path: '/offers',
				element: <Offers />,
			},
			{
				path: '/checkout',
				element: <CheckoutPage />,
			},
			{
				path: '/search',
				element: <Search />,
			},
			{
				path: '/account',
				element: <Profile />,
			},
			{
				path: '/restaurants/:slug',
				element: <RestaurantPage />,
			},
		],
	},
]);

const App = () => {
	return (
		<Provider store={store}>
			<RouterProvider router={appRouter} />
		</Provider>
	);
};
export default App;
