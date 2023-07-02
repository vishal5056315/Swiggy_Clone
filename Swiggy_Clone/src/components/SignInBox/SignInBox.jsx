import { useState } from 'react';
import './SignInBox.scss';
import { auth } from '../../auth/firebase';
import {
	GoogleAuthProvider,
	GithubAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
	onAuthStateChanged,
} from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { GoMarkGithub } from 'react-icons/go';
import { BsGoogle } from 'react-icons/bs';
import { login } from '../../redux/slice/authSlice';
import { updateSigninSideVisible } from '../../redux/slice/loginSlice';
import Swal from 'sweetalert2';
import validator from 'validator';
import { ReactComponent as LoadingIcon } from './../../assets/loading.svg';

const SignInBox = () => {
	const dispatch = useDispatch();
	const [state, setState] = useState({
		email: '',
		password: '',
	});
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isLoggingIn, setIsLoggingIn] = useState('');
	const [errorIn, setErrorIn] = useState('');

	const changeHandler = e => {
		setErrorIn('');
		setState({
			...state,
			[e.target.name]: e.target.value,
		});
	};

	const loginHandler = () => {
		if (!validator.isEmail(state.email.trim())) {
			return setErrorIn('email');
		}
		if (state.password.trim().length < 8) {
			return setErrorIn('password');
		}
		setIsLoggingIn('emailpass');
		signInWithEmailAndPassword(auth, state.email, state.password)
			.then(result => {
				const user = result.user;
				dispatch(
					login({
						displayName: user.displayName,
						email: user.email,
						photoURL: user.photoURL,
						emailVerified: user.emailVerified,
						providerId: result?.providerId,
					})
				);
				setIsLoggingIn('');
				dispatch(updateSigninSideVisible(false));
				Swal.fire('Success!', `You're log in successfully!`, 'success');
			})
			.catch(error => {
				Swal.fire('Failed!', error.message, 'error');
				setIsLoggingIn('');
			});
	};
	const loginFunGoogle = async () => {
		setIsLoggingIn('google');
		const provider = new GoogleAuthProvider();
		try {
			const result = await signInWithPopup(auth, provider);
			dispatch(
				login({
					displayName: result?.user?.displayName,
					email: result?.user?.email,
					photoURL: result?.user?.photoURL,
					emailVerified: result?.user?.emailVerified,
					providerId: result?.providerId,
				})
			);
			Swal.fire('Success!', `You're log in successfully!`, 'success');
			dispatch(updateSigninSideVisible(false));
		} catch (error) {
			Swal.fire('Failed!', error.message, 'error');
		}
		setIsLoggingIn('');
	};

	const loginFunGitHub = async () => {
		setIsLoggingIn('github');
		const provider = new GithubAuthProvider();
		try {
			const result = await signInWithPopup(auth, provider);
			dispatch(
				login({
					displayName: result?.user?.displayName,
					email: result?.user?.providerData?.[0]?.email,
					photoURL: result?.user?.photoURL,
					emailVerified: result?.user?.emailVerified,
					providerId: result?.providerId,
				})
			);
			Swal.fire('Success!', `You're log in successfully!`, 'success');
			dispatch(updateSigninSideVisible(false));
		} catch (error) {
			Swal.fire('Failed!', error.message, 'error');
		}
		setIsLoggingIn('');
	};

	return (
		<div className="signin-box">
			{errorIn && (
				<div className="err-text">
					{errorIn === 'email'
						? 'Please enter a valid email!'
						: 'Password should atleast 8 character long!'}
				</div>
			)}
			<input
				type="email"
				value={state.name}
				onChange={changeHandler}
				name="email"
				placeholder="Email"
				className={`${errorIn === 'email' ? 'err' : ''}`}
			/>
			<div>
				<input
					type={`${isPasswordVisible ? 'text' : 'password'}`}
					value={state.password}
					onChange={changeHandler}
					name="password"
					placeholder="Password"
					className={`${errorIn === 'password' ? 'err' : ''}`}
				/>

				{isPasswordVisible ? (
					<AiOutlineEyeInvisible
						onClick={() => setIsPasswordVisible(prev => !prev)}
						className="eye"
					/>
				) : (
					<AiOutlineEye
						onClick={() => setIsPasswordVisible(prev => !prev)}
						className="eye"
					/>
				)}
			</div>
			<button disabled={isLoggingIn} onClick={loginHandler}>
				{isLoggingIn === 'emailpass' ? (
					<LoadingIcon className="loading-icon" />
				) : (
					'LOGIN'
				)}
			</button>
			<button
				className="github"
				disabled={isLoggingIn}
				onClick={loginFunGoogle}>
				{isLoggingIn === 'google' ? (
					<LoadingIcon className="loading-icon" />
				) : (
					<>
						Continue with <BsGoogle className="icon" />
					</>
				)}
			</button>
			<button
				className="google"
				disabled={isLoggingIn}
				onClick={loginFunGitHub}>
				{isLoggingIn === 'github' ? (
					<LoadingIcon className="loading-icon" />
				) : (
					<>
						Continue with <GoMarkGithub className="icon" />
					</>
				)}
			</button>
		</div>
	);
};

export default SignInBox;
