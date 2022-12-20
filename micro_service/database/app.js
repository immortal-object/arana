import mysql from 'mysql';

export class Database {
	#connection;

	constructor(config) {
		this.#connection = mysql.createConnection({
		    host: config.host,
		    user: config.user,
		    password: config.password,
		    database: config.db
		});
		this.#connection.connect();
	}

	query(query) {
		return new Promise((resolve, reject) => {
			this.#connection.query(query, (err, res, fields) => {
				if (err != null) reject(err);

				resolve(res);
			})
		});
	}

	is_registered(user) {
		return new Promise((resolve, reject) => {
			this.query(`SELECT * FROM users WHERE user_id = ${user};`).then(res => {
				if (res.length === 0) resolve(false);
				resolve(true);
			}, err => {
				reject(false);
			});
		});
	}

	register(user) {
		return new Promise((resolve, reject) => {
			this.query(`INSERT INTO users (user_id) VALUE (${user});`).then(res => {
				resolve(true);
			}, err => {
				reject(false);
			});
		});
	}

	get_id(user) {
		return new Promise((resolve, reject) => {
			this.query(`SELECT id FROM users WHERE user_id = ${user};`).then(res => {
				if (res.length == 0) resolve(-1);
				resolve(res[0].id);
			}, err => {
				reject(err);
			});
		});
	}

	get_user(user) {
		return new Promise((resolve, reject) => {
			this.get_id(user).then(res => {
				let id = res;
				this.query(`SELECT project FROM pool WHERE id = ${id}`).then(res => {
					let sub = [];
					res.forEach(x => sub.push(x.project));

					resolve({
						id: id,
						sub: sub
					});
				}, err => {
					reject(err);
				});
			}, err => {
				reject(err);
			});
		});
	}

	sub(id, project) {
		return new Promise((resolve, reject) => {
			this.query(`INSERT INTO pool VALUE (${id}, '${project}');`).then(res => {
				resolve(res);
			}, err => {
				reject(err);
			});
		});
	}

	unsub(id, project) {
		return new Promise((resolve, reject) => {
			this.query(`DELETE FROM pool WHERE project = '${project}' AND id = ${id};`).then(res => {
				resolve(res);
			}, err => {
				reject(err);
			});
		});
	}

	statistic() {
		return new Promise((resolve, reject) => {
			this.query(`SELECT COUNT (id) AS statistic FROM pool WHERE project = 'earth' UNION ALL SELECT COUNT(id) FROM pool WHERE project = 'moon' UNION ALL SELECT COUNT(id) FROM pool WHERE project = 'mercury';`).then(res => {
				resolve(res.map(x => x.statistic));
			}, err => {
				reject(err);
			});
		});
	}
}