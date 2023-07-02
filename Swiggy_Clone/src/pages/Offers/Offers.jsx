import './Offers.scss';
import PaddingTop from '../../utils/PaddingTop';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ALL_RESTAURANTS_API_LINK } from '../../utils/config';
import Loading from '../../components/Loading/Loading';
import { v4 as uuidv4 } from 'uuid';
import Error from '../Error/Error';
import staticRestaurant from '../../utils/restaurantList';
import Main from '../../components/Main/Main';
import FloatingCart from '../../components/FloatingCart/FloatingCart';

const Offers = () => {
	const [carousels, setCarousels] = useState([]);
	const [allRestaurants, setAllRestaurants] = useState([]);
	const [filterAllRestaurants, setFilterAllRestaurants] = useState([]);
	const [activeFilter, setActiveFilter] = useState('relevance');
	const [apiFailed, setApiFaildes] = useState('');
	document.title = `Swiggy Clone - Pulkit Kumar`;
	const getAllRestaurants = async () => {
		try {
			const { data } = await axios.get(ALL_RESTAURANTS_API_LINK);
			setCarousels(data?.data?.cards?.[0]?.data?.data?.cards);
			setAllRestaurants(data?.data?.cards?.[2]?.data?.data?.cards);
			setFilterAllRestaurants(data?.data?.cards?.[2]?.data?.data?.cards);
		} catch (err) {
			try {
				setCarousels(
					staticRestaurant?.data?.cards?.[0]?.data?.data?.cards
				);
				setAllRestaurants(
					staticRestaurant?.data?.cards?.[2]?.data?.data?.cards
				);
				setFilterAllRestaurants(
					staticRestaurant?.data?.cards?.[2]?.data?.data?.cards
				);
			} catch (err) {
				setApiFaildes(err);
			}
		}
		window.scrollTo(0, 0);
	};
	// console.log(allRestaurants);
	useEffect(() => {
		getAllRestaurants();
	}, []);

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
			<div className="offers-wrapper">
				<div className="offers">
					<div className="left">
						<div className="top">Offers for you</div>
						<div className="bottom">
							Explore top deals and offers exclusively for you!
						</div>
					</div>
					<img
						src="https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/KHu24Gqw_md3ham"
						alt="offers"
					/>
				</div>
			</div>
			<Main
				topHeading={'All offers'}
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
				allRestaurants={allRestaurants}
				filterAllRestaurants={filterAllRestaurants}
				setFilterAllRestaurants={setFilterAllRestaurants}
			/>
			<FloatingCart />
		</PaddingTop>
	);
};

export default Offers;
