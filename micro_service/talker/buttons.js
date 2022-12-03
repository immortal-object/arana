export class Buttons {
	constructor() {}

	generate(arr = []) {
		return {
			reply_markup: {
				inline_keyboard: arr
			},
			parse_mode: 'HTML'
		}
	}

	projects(sub) {
		let responce = [];
		let planets = {
			earth: false,
			moon: false,
			mercury: false
		};

		sub.forEach(x => planets[x] = true);

		for (let planet in planets) {
			responce.push(`${planet} ${planets[planet] === true ? '✅' : '❌'}`);
		}

		responce = responce.map(x => [{text: x, callback_data: x.split(' ')[0]}]);
		return responce;
	}
}