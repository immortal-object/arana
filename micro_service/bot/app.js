import api from 'node-telegram-bot-api';
import { Talker } from '../talker/app.js';
import { Database } from '../database/app.js';

let tk = new Talker();

export class Bot {
	#bot;
	#admins;
	#active;
	#db;

	constructor(config) {
		this.#bot = new api(config.token, {polling: true});
		this.#admins = config.admins;
		this.#active = false;
		this.#db = new Database(config.db);
	}

	valid(user, chat, text) {
		if (user !== chat) return false;
		if (text === undefined) return false;
		return true;
	}

	is_admin(user) {
		if (this.#admins.indexOf(user) !== -1) return true;
		return false;
	}

	alert_error(id) {
		return this.#bot.answerCallbackQuery(id, {
			text: 'Произошла системная ошибка.',
			show_alert: true
		});
	}

	sub_alert(id, sub, project) {
		let enteraction = 'подписались на проект';
		if (sub === false) enteraction = 'отписались от проекта';

		return this.#bot.answerCallbackQuery(id, {
			text: `Вы успешно ${enteraction} "${project}"`,
			show_alert: true
		});
	}

	edit_msg(text, chat, msg_id, buttons = []) {
		this.#bot.editMessageText(text, {
			chat_id: chat,
			message_id: msg_id,
			parse_mode: 'HTML',
			reply_markup: {
				inline_keyboard: buttons
			}
		});
	}

	run() {
		if (this.#active === true) return false;
		this.#active = true;

		this.#bot.on('message', msg => {
			let user = msg.from.id;
			let chat = msg.chat.id;
			let text = msg.text;

			if (this.valid(user, chat, text) === false) return;
			if (this.is_admin(user) === true) {
				return this.admin_text(user, text);
			}
			return this.user_text(user, text);
		});

		this.#bot.on('callback_query', data => {
			let user = data.from.id;
			let text = data.data;
			let id = data.id;
			let msg_id = data.message.message_id;
			
			return this.user_button(user, text, id, msg_id);
		})
	}

	notify(users, message) {
		return new Promise((resolve, reject) => {
			let i = 0;
			let responce = [];

			users.forEach(id => {
				this.#bot.sendMessage(id, message).then(res => {
					i++;
					if (i === users.length) {
						if (responce.length == 0) {
							resolve(responce);
						} else {
							reject(responce);
						}
					} 
				}, err => {
					responce.push(id);
					i++;
					if (i === users.length) reject(responce);
				});
			});
		});
	}

	user_text(user, text) {
		if (text == '/start') {
			this.#db.is_registered(user).then(res => {
				if (res === true) return;
				this.#db.register(user).then(res => {
					let [st, art] = tk.start();
					return this.#bot.sendMessage(user, st,art);
				}, err => {
					let [er, ror] = tk.error();
					return this.#bot.sendMessage(user, er,ror);
				});
			}, err => {
				let [er, ror] = tk.error();
				return this.#bot.sendMessage(user, er,ror);
			});
		}	
		if (text == '/projects') {
			this.#db.get_user(user).then(res => {
				let [proj, ects] = tk.projects(res.sub);
				return this.#bot.sendMessage(user, proj,ects);
			}, err => {
				let [er, ror] = tk.error();
				return this.#bot.sendMessage(user, er,ror);
			});
		}
	}

	user_button(user, data, id, msg_id) {
		if (['earth', 'moon', 'mercury'].indexOf(data) != -1) {
			this.#db.get_user(user).then(res => {
				let _id = res.id;
				let new_sub = res.sub;

				if (res.sub.indexOf(data) === -1) {
					this.#db.sub(_id, data).then(res => {
						new_sub.push(data);
						let [proj, ects] = tk.projects(new_sub);
						this.edit_msg(proj, user, msg_id, ects.reply_markup.inline_keyboard);
						this.sub_alert(id, true, data);
						return;
					}, err => {
						return this.alert_error(id);
					});
				} else {
					this.#db.unsub(_id, data).then(res => {
						new_sub.splice(new_sub.indexOf(data), 1);
						let [proj, ects] = tk.projects(new_sub);
						this.edit_msg(proj, user, msg_id, ects.reply_markup.inline_keyboard);
						this.sub_alert(id, false, data);
						return;
					}, err => {
						return this.alert_error(id);
					});
				}
			}, err => {
				return this.alert_error(id);
			});
		}
	}

	admin_text(user, text) {
		if (text == '/start') {
			let [ad, min] = tk.admin();
			return this.#bot.sendMessage(user, ad,min);
		}
		if (text == '/projects') {
			this.#db.statistic().then(res => {
				let [stati, stic] = tk.statistic(res);
				return this.#bot.sendMessage(user, stati,stic);
			}, err => {
				let [er, ror] = tk.error();
				return this.#bot.sendMessage(user, er,ror);
			})
		}
	}
}