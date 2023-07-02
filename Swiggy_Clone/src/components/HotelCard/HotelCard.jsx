import './HotelCard.scss';
import { IMG_LINK } from '../../utils/config';
import { BsDot } from 'react-icons/bs';
import { AiFillStar } from 'react-icons/ai';
import { ReactComponent as OffersIcon } from './../../assets/icons/offers.svg';
import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
	return (
		<Link
			to={`/restaurants/${hotel?.data?.slugs?.restaurant}-${hotel?.data?.id}`}
			className="hotel-card-wrapper">
			{hotel?.data?.promoted && (
				<div className="promotion-tag">
					<div className="text">PROMOTED</div>
					<div className="style"></div>
				</div>
			)}
			<div className="hotel-card">
				{hotel?.data?.cloudinaryImageId ? (
					<img
						src={IMG_LINK + hotel?.data?.cloudinaryImageId}
						alt={hotel?.data?.name}
					/>
				) : (
					<div className="img-cover">NO COVER IMAGE</div>
				)}

				<div className="title">
					<span>{hotel?.data?.name}</span>
					<span>{hotel?.data?.cuisines?.join(', ')}</span>
				</div>
				<div className="rating">
					<span
						style={{
							background:
								hotel?.data?.avgRating >= 4
									? 'var(--color-green)'
									: 'var(--color-yellow)',
						}}>
						<AiFillStar className="icon" />
						<span>{hotel?.data?.avgRating}</span>
					</span>
					<BsDot />
					<span>{hotel?.data?.slaString}</span>
					<BsDot />

					<span>{hotel?.data?.costForTwoString}</span>
				</div>
				{hotel?.data?.aggregatedDiscountInfo?.shortDescriptionList?.[0]
					?.meta && (
					<div className="offer">
						<OffersIcon className="icon" />
						<span>
							{
								hotel?.data?.aggregatedDiscountInfo
									?.shortDescriptionList?.[0]?.meta
							}
						</span>
					</div>
				)}
				<div></div>
			</div>
		</Link>
	);
};

export default HotelCard;
