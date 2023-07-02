const Mailgen = require('mailgen');
const orderCompleteMail = (userData, orderList) => {
	const mailGenerator = new Mailgen({
		theme: 'salted',
		product: {
			// Appears in header & footer of e-mails
			name: 'Swiggy Clone',
			link: 'https://swiggy-vivek.vercel.app/',
			// Optional product logo
			// logo: 'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_284/Logo_f5xzza',
		},
	});
	const email = {
		body: {
			name: userData.displayName,
			intro: 'Your order has been processed successfully.',
			table: {
				data: orderList,
				columns: {
					// Optionally, customize the column widths
					customWidth: {
						item: '20%',
						price: '15%',
					},
					// Optionally, change column text alignment
					customAlignment: {
						price: 'right',
					},
				},
			},
			action: {
				instructions: 'You can order more on our app:',
				button: {
					color: '#3869D4',
					text: 'Go to Homepage',
					link: 'https://swiggy-vivek.vercel.app/',
				},
			},
			outro: 'We thank you for your purchase.',
		},
	};
	const emailBody = mailGenerator.generate(email);
	return emailBody;
};

module.exports = { orderCompleteMail };
