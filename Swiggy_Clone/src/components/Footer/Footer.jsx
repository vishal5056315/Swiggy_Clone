import { Link } from 'react-router-dom';
import './Footer.scss';
import { FaTwitter, FaLinkedinIn, FaInstagram, FaGithub } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Footer = () => {
	const items = useSelector(state => state.cart.items);
	return (
		<section
			className="footer-wrapper"
			style={{
				marginBottom: items?.length > 0 ? '40px' : '',
			}}>
			<div className="footer">
				<a href={'#'}>
					<img
						src="https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_284/Logo_f5xzza"
						alt=""
					/>
				</a>
				<div className="copy">
					<div> &copy; 2023 Swiggy Clone </div>
					<div
						style={{
							textAlign: 'center',
							padding: '5px 0',
						}}>
						by Pulkit
					</div>
				</div>
				<div className="socials">
					
					<Link
						to={'https://www.linkedin.com/in/pulkit-kumar-4ab057253/'}
						target="_blank">
						<FaLinkedinIn className="icon" />
					</Link>
					<Link to={'https://instagram.com/2802_pulkitbansal'} target="_blank">
						<FaInstagram className="icon" />
					</Link>
					<Link to={'https://github.com/Pulkit0900'} target="_blank">
						<FaGithub className="icon" />
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Footer;
