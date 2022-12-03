import { Bot } from './micro_service/bot/app.js';

let arana = new Bot({
	token: 'TOKEN',
	admins: [],
	db: {
		host: 'HOST',
		user: 'USERNAME',
		password: 'PASSWORD',
		db: 'DATABASE'
	}
});

arana.run();
