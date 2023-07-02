import './Error.scss';
import PaddingTop from '../../utils/PaddingTop';

const Error = err => {
	document.title = `Error - Swiggy Clone - Pulkit Kumar`;
	return (
		<PaddingTop>
			<div className="error-wrapper">
				<div className="error">
					<h1>Uh-oh!</h1>
					<p>Sorry! This should not have happened. Please retry.</p>
					<div className="links">
						<span
							onClick={() => {
								window.location.reload();
							}}
							className="retry">
							Retry
						</span>
					</div>
				</div>
			</div>
		</PaddingTop>
	);
};

export default Error;
