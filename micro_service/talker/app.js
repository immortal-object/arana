import { Buttons } from './buttons.js';

export class Talker extends Buttons {
	constructor() {
		super();
	}

	header = '<b>Arana World🌍</b>\n\n';
	header2 = '<b>Админ</b> ' + this.header;

	error() {
		return [this.header + 'Произошла системная ошибка.', super.generate()];
	}

	start() {
		return [this.header + 'Добро пожаловать в мир Arana👋.\nВы можете отслеживать жизнь наших планет🪐.\nОзнакомьтесь с проектами🧾 использовав команду <b>/projects</b>.', super.generate()];
	}

	projects(sub) {
		return [this.header + 'Чтобы отписаться или подписаться на проект планеты🪐 и отслеживать течение жизни нажмите кнопку ниже👇.', super.generate(super.projects(sub))];
	}

	admin() {
		return [this.header2 + 'Используйте команду <b>/projects</b>, чтобы ознакомиться со статистикой по проектам🧾.', super.generate()];
	}

	statistic(sub) {
		return [this.header2 + `Количество подписчиков в проектах:\n\n<b>Earth</b>: <b>${sub[0]}</b>👥\n<b>Moon</b>: <b>${sub[1]}</b>👥\n<b>Mercury</b>: <b>${sub[2]}</b>👥`, super.generate()];
	}
}