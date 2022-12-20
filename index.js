import { Bot } from './micro_service/bot/app.js';

let arana = new Bot({
	token: '5989764052:AAHFtzLmqFELQFys_VXr72oTzFjMPT8maPw',
	admins: [982029972],
	db: {
		host: 'localhost',
		user: 'root',
		password: 'sdghsdkg3762A',
		db: 'arana'
	}
});

arana.run();