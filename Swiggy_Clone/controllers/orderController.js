const { orderCompleteMail } = require('./../config/mailGen');
const transporter = require('./../config/emailConfig');

const orderController = async (req, res) => {
	const { userData, orderList } = req.body;

	try {
		const emailBody = orderCompleteMail(userData, orderList);
		await transporter.sendMail({
			from: process.env.EMAIL_FROM,
			to: userData.email,
			subject: 'Swiggy Clone: Order confirmation email!',
			html: emailBody,
		});
		res.status(200).json({
			status: 'success',
			message: 'Order placed successfully!',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			status: 'fail',
			message: 'Something went wrong!',
		});
	}
};

module.exports = { orderController };
