import './Home.scss';
import PaddingTop from '../../utils/PaddingTop';
import CarouselCard from '../../components/CarouselCard/CarouselCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ALL_RESTAURANTS_API_LINK } from '../../utils/config';
import Loading from '../../components/Loading/Loading';
import { v4 as uuidv4 } from 'uuid';
import Error from '../Error/Error';
import staticRestaurant from './../../utils/restaurantList';
import Main from '../../components/Main/Main';
import { useSelector } from 'react-redux';
import FloatingCart from '../../components/FloatingCart/FloatingCart';

const Home = () => {
	const [carousels, setCarousels] = useState([]);
	const [allRestaurants, setAllRestaurants] = useState([]);
	const [filterAllRestaurants, setFilterAllRestaurants] = useState([]);
	const [activeFilter, setActiveFilter] = useState('relevance');
	const [apiFailed, setApiFaildes] = useState('');
	const [notFound, setNotFound] = useState(false);
	const [offset, setOffset] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [totalOpenRestaurants, setTotalOpenRestaurants] = useState(0);
	document.title = `Swiggy Clone - Vivek Kumar`;

	const searchText = useSelector(state => state.search.text);
	const getAllRestaurants = async () => {
		try {
			const { data } = await axios.get(ALL_RESTAURANTS_API_LINK);
			setCarousels(data?.data?.cards?.[0]?.data?.data?.cards);
			// setAllRestaurants(data?.data?.cards?.[2]?.data?.data?.cards);
			// setFilterAllRestaurants(data?.data?.cards?.[2]?.data?.data?.cards);
			setTotalOpenRestaurants(
				data?.data?.cards?.[2]?.data?.data?.totalOpenRestaurants
			);
		} catch (err) {
			try {
				setCarousels(
					staticRestaurant?.data?.cards?.[0]?.data?.data?.cards
				);
				// setAllRestaurants(
				// 	staticRestaurant?.data?.cards?.[2]?.data?.data?.cards
				// );
				// setFilterAllRestaurants(
				// 	staticRestaurant?.data?.cards?.[2]?.data?.data?.cards
				// );
			} catch (err) {
				setApiFaildes(err);
			}
		}
		window.scrollTo(0, 0);
	};
	const getRestaurantMore = async () => {
		setIsLoading(true);
		try {
			const { data } = await axios.get(
				`https://corsproxy.io/?https://www.swiggy.com/dapi/restaurants/list/v5?lat=25.5940947&lng=85.1375645&offset=${offset}&sortBy=RELEVANCE&pageType=SEE_ALL&page_type=DESKTOP_SEE_ALL_LISTING`
			);
			setAllRestaurants(prev => [
				...prev,
				...data?.data?.cards.map(el => el.data),
			]);
			setFilterAllRestaurants(prev => [
				...prev,
				...data?.data?.cards.map(el => el.data),
			]);
			setIsLoading(false);
		} catch (err) {
			setApiFaildes(err);
			setIsLoading(false);
		}
	};

	const handleScroll = async () => {
		if (
			window.innerHeight + document.documentElement.scrollTop + 1 >=
			document.documentElement.scrollHeight
		) {
			setOffset(prev => prev + 16);
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		getAllRestaurants();
	}, []);
	useEffect(() => {
		getRestaurantMore();
	}, [offset]);

	useEffect(() => {
		if (searchText.trim() === '') {
			setFilterAllRestaurants(allRestaurants);
			setNotFound(false);
			return;
		}
		const newList = allRestaurants.filter(el =>
			el?.data?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
		);
		if (newList.length === 0) {
			setNotFound(true);
			return;
		}
		setFilterAllRestaurants(newList);
	}, [searchText]);

	if (apiFailed) {
		return <Error {...apiFailed} />;
	}

	return filterAllRestaurants?.length === 0 ? (
		<PaddingTop>
			<div className="carousel-loading-wrapper">
				<div className="carousel-loading">
					<div>
						<div className="animate"></div>
						<img
							src="https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/icecream_wwomsa"
							alt="ice-cream"
						/>
					</div>
					<div>Looking for great food near you...</div>
				</div>
				<div
					className="sckelton"
					style={{
						width: '70%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						margin: '1rem auto',
						gap: '1rem',
						flexWrap: 'wrap',
					}}>
					{new Array(12).fill(0).map(() => (
						<Loading key={uuidv4()} />
					))}
				</div>
			</div>
		</PaddingTop>
	) : (
		<PaddingTop>
			<CarouselCard carousels={carousels} />
			{!notFound ? (
				<Main
					topHeading={'restaurants'}
					activeFilter={activeFilter}
					setActiveFilter={setActiveFilter}
					allRestaurants={allRestaurants}
					filterAllRestaurants={filterAllRestaurants}
					setFilterAllRestaurants={setFilterAllRestaurants}
					isLoading={isLoading}
					totalOpenRestaurants={totalOpenRestaurants}
				/>
			) : (
				<div className="not-found">
					<h1>Uh-oh!</h1>
					<p>
						Sorry! No restaurant found with{' '}
						<strong>{searchText}</strong> name.
					</p>
				</div>
			)}
			<FloatingCart />
		</PaddingTop>
	);
};

export default Home;
