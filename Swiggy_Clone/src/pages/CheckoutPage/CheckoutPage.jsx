import './CheckoutPage.scss';
import PaddingTop from '../../utils/PaddingTop';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IMG_LINK } from '../../utils/config';
import { BiMinus, BiPlus } from 'react-icons/bi';
import {
	clearCart,
	decreaseQuantity,
	increaseQuantity,
	removeFromCart,
} from '../../redux/slice/cartSlice';

import { ReactComponent as LoadingIcon } from './../../assets/loading.svg';
import Swal from 'sweetalert2';
import { updateSigninSideVisible } from '../../redux/slice/loginSlice';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../../auth/firebase';
import { useState } from 'react';
import axios from 'axios';

const CheckoutPage = () => {
	const cart = useSelector(state => state.cart.items);
	const userAuth = useSelector(state => state.auth.isAuth);
	const userData = useSelector(state => state.auth.user);
	const emailVerified = useSelector(state => state.auth.user.emailVerified);
	const [isOrdering, setIsOrdering] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const verifyAccount = async () => {
		try {
			await sendEmailVerification(auth.currentUser);
			Swal.fire('Check email!', `Verification send to email!`, 'success');
		} catch (error) {
			Swal.fire('Failed!', error.message, 'error');
		}
	};
	const sendEmailHandler = async () => {
		setIsOrdering(true);
		try {
			const arr = cart?.map(el => {
				return {
					name: el?.info?.name,
					quantity: el?.quantity,
					price:
						(el?.info?.price ||
							el?.info?.defaultPrice ||
							el?.info?.variantsV2?.pricingModels?.[0]?.price) /
						100,
				};
			});
			arr.push({
				name: 'Total',
				quantity: arr.reduce((acc, cur) => {
					return (acc += cur?.quantity);
				}, 0),
				price: arr.reduce((acc, cur) => {
					return (acc += cur?.quantity * cur?.price);
				}, 0),
			});

			await axios.post(
				'https://swiggy-clone-wjqx.onrender.com/api/v1/order',
				{
					userData,
					orderList: arr.map(el => {
						return {
							...el,
							price: `₹${el.price.toLocaleString()}`,
						};
					}),
				}
			);
			setIsOrdering(false);

			Swal.fire({
				title: 'Order Successful!',
				text: 'Check your email for order details!',
				icon: 'success',
			}).then(result => {
				if (result.isConfirmed) {
					dispatch(clearCart());
					navigate('/');
				}
			});
		} catch (error) {
			setIsOrdering(false);
			Swal.fire('Failed!', error.message, 'error');
		}
	};
	window.scrollTo(0, 0);
	if (cart.length === 0) {
		return (
			<PaddingTop>
				<div className="error-wrapper">
					<div className="error">
						<img
							className="img"
							src="https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/2xempty_cart_yfxml0"
							alt=""
						/>
						<h1>Your cart is empty</h1>
						<p>You can go to home page to view more restaurants</p>
						<div className="links">
							<span
								onClick={() => {
									navigate('/');
								}}
								className="retry">
								SEE RESTAURANTS NEAR YOU
							</span>
						</div>
					</div>
				</div>
			</PaddingTop>
		);
	}

	return (
		<PaddingTop>
			<div className="checkout-wrapper">
				<div className="checkout">
					<div className="nav">
						<button
							className="bck"
							onClick={() => {
								navigate(-1);
							}}>
							Back
						</button>
						<button
							className="clr"
							onClick={() => {
								Swal.fire({
									title: 'Clear cart?',
									text: 'Dou you want to clear cart?',
									icon: 'question',
									showCancelButton: true,
									confirmButtonColor: '#3085d6',
									cancelButtonColor: '#d33',
									confirmButtonText: 'Yes, Clear!',
								}).then(result => {
									if (result.isConfirmed) {
										dispatch(clearCart());
									}
								});
							}}>
							Clear Cart
						</button>
					</div>
					<div className="items-wrapper">
						{cart.map(el => (
							<div key={uuidv4()} className="item">
								<div className="name">
									{el?.info?.imageId ? (
										<img
											className="img"
											src={IMG_LINK + el?.info?.imageId}
											alt=""
										/>
									) : (
										<div className="img">NO IMG</div>
									)}

									<span>{el?.info?.name}</span>
								</div>
								<div className="controls">
									<div>
										<span
											onClick={() => {
												if (el?.quantity > 1) {
													dispatch(
														decreaseQuantity(
															el?.info?.id
														)
													);
												} else if (el?.quantity === 1) {
													dispatch(
														removeFromCart(
															el?.info?.id
														)
													);
												}
											}}
											className="btns">
											<BiMinus />
										</span>
										<span>{el?.quantity}</span>
										<span
											onClick={() => {
												dispatch(
													increaseQuantity(
														el?.info?.id
													)
												);
											}}
											className="btns">
											<BiPlus />
										</span>
									</div>
								</div>
								<div className="price">
									₹
									{(el?.info?.price
										? (el?.info?.price * el?.quantity) / 100
										: el?.info?.defaultPrice
										? (el?.info?.defaultPrice *
												el?.quantity) /
										  100
										: el?.info?.variantsV2
												?.pricingModels?.[0]?.price /
										  100
									).toLocaleString()}
								</div>
							</div>
						))}
					</div>
					<div className="price-box">
						<span className="price-tag">Total Amount</span>
						<span className="price">
							₹{' '}
							{(
								cart?.reduce((acc, el) => {
									return el?.info?.price
										? acc + el?.info?.price * el?.quantity
										: el?.info?.defaultPrice
										? acc +
										  el?.info?.defaultPrice * el?.quantity
										: acc +
										  el?.info?.variantsV2
												?.pricingModels?.[0]?.price *
												el?.quantity;
								}, 0) / 100
							).toLocaleString()}
						</span>
					</div>
					<div
						onClick={() => {
							if (!userAuth) {
								return Swal.fire({
									title: 'Please login first!',
									text: 'After login you can order!',
									icon: 'warning',
									showCancelButton: true,
									confirmButtonColor: '#3085d6',
									cancelButtonColor: '#d33',
									confirmButtonText: 'Yes, Login!',
								}).then(result => {
									if (result.isConfirmed) {
										dispatch(updateSigninSideVisible(true));
									}
								});
							}
							if (!emailVerified) {
								return Swal.fire({
									title: 'Please verify email!',
									text: 'We will send order details to email!',
									icon: 'warning',
									showCancelButton: true,
									confirmButtonColor: '#3085d6',
									cancelButtonColor: '#d33',
									confirmButtonText: 'Verify!',
								}).then(result => {
									if (result.isConfirmed) {
										verifyAccount();
									}
								});
							}

							sendEmailHandler();
						}}
						className="order-box">
						<button disabled={isOrdering}>
							{isOrdering ? (
								<LoadingIcon className="loading-icon" />
							) : (
								'Order'
							)}
						</button>
					</div>
				</div>
			</div>
		</PaddingTop>
	);
};

export default CheckoutPage;
